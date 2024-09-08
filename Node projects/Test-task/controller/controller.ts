import fetch from "node-fetch";

type ResponseFiltersTypOne = {
  id: string;
  condition: "equals" | "does_not_equal" | "greater_than" | "less_than";
  value: number | string;
}[];

function applyFilters(apiResponse: any[], filters: ResponseFiltersTypOne) {
  const filteredResponse = apiResponse.map((response) => {
    let matchedFiltersCount = 0;

    const filteredQuestions = response.questions.filter(
      (question: { id: string; value: string }) => {
        const matchesFilter = filters.some((filter) => {
          if (question.id === filter.id) {
            const matched =
              question.value !== null &&
              (filter.condition === "equals"
                ? question.value === filter.value
                : filter.condition === "does_not_equal"
                ? question.value !== filter.value
                : filter.condition === "greater_than"
                ? question.value > filter.value
                : filter.condition === "less_than"
                ? question.value < filter.value
                : false);

            if (matched) {
              matchedFiltersCount++;
              return true;
            }
          }

          return false;
        });
        return matchesFilter;
      }
    );

    if (matchedFiltersCount === filters.length) {
      return {
        ...response,
        questions: filteredQuestions,
      };
    } else {
      return null;
    }
  });

  const selectedData = filteredResponse.filter((response) => {
  
  return response !== null})

 
  return {
    responses: selectedData,
    totalResponses: selectedData.length
  };
}

function filterDataByDate(filteredData: any, afterDate?: string, beforeDate?: string) {
    let newFilterData = []; 

    if(afterDate) {
        newFilterData = filteredData.responses.map((item: any) => 
            new Date(afterDate).toISOString() > new Date(item.submissionTime).toISOString()
            ? null : item
        )
    }

    if(beforeDate){
        newFilterData = filteredData.responses.map((item: any) => 
            new Date(item.submissionTime).toISOString() > new Date(beforeDate).toISOString()
            ? null : item
        )
    }

    return newFilterData.filter(Boolean);
  }



export const getData = async (req: any, res: any) => {
  try {
    const { filter, limit, offset,beforeDate,afterDate } = req.query;

    let filterData: any;
    if (filter) {
      try {
        filterData = JSON.parse(filter);
        if (!Array.isArray(filterData)) {
          throw new Error("Filter data must be an array");
        }
      } catch (err) {
        throw new Error("Invalid JSON or filter data in the query parameter");
      }
    }

    const requestOptions: any = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };

    let apiUrl = `https://api.fillout.com/v1/api/forms/${req.params.id}/submissions`;
    if (limit) apiUrl += `?limit=${limit}`;
    if (offset) apiUrl += `&offset=${offset}`;

    const data = await fetch(apiUrl, requestOptions);
    const prevApiResponse = await data.json();

    const pageCount = limit
      ? Math.ceil(prevApiResponse.totalResponses / Number(limit))
      : 1;

    let filteredData = filterData
      ? applyFilters(prevApiResponse.responses, filterData)
      : prevApiResponse;

      if (!afterDate && !beforeDate) {
        res.json({ ...filteredData, pageCount });
    } else {
        const filterNewData = await filterDataByDate(filteredData, afterDate, beforeDate);
        res.json({ responses:[...filterNewData], totalResponses: filterNewData.length ,pageCount });
    }
    
  } catch (error: any) {
    console.log("error", error);
  }
};
