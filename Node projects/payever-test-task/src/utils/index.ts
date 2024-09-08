import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fetch from 'node-fetch';
import * as fs from 'fs';
async function connection() {
  const mongoServer = new MongoMemoryServer();
  const uri = await mongoServer.getUri();

  return MongooseModule.forRoot(uri, { dbName: 'users' });
}

async function getApi(id: string) {
  const data = await fetch('https://reqres.in/api/users/' + id)
  const json = await data.json();
  return json.data
}

async function downloadAndSaveImage(url: string, destinationPath: string,isDown?: boolean) {
  console.log(url)
  const response = await fetch(url);
  const fileStream = fs.createWriteStream(destinationPath);
  if(isDown){
    const buffer = await response.buffer();
    const base64 = buffer.toString('base64');
    return base64
  }
  return new Promise<void>((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', (err) => {
      reject(err);
    });
    fileStream.on('finish', () => {
      resolve();
    });
  });
}
async function loaclImgToBase64(url: string){
  try{
    const buffer = fs.readFileSync(url);
    const base64 = buffer.toString('base64');
    return 'data:image/png;base64,'+base64
  } catch(err){
    return err
  }
}

async function ensureDirectoryExists(directory: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.mkdir(directory, { recursive: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export default { connection, getApi, downloadAndSaveImage, ensureDirectoryExists, loaclImgToBase64 }