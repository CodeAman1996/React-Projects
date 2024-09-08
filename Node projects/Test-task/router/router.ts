import express, { Router } from 'express';
import { getData } from '../controller/controller'; 

const router: Router = express.Router();

router.get('/:id/filteredResponses', getData);

export { router };



