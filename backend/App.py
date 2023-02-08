from fastapi import FastAPI, Query, Response
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def get_data(cols: list[str] = Query(default=None), filters: str = None, limit: int = 10):
    df1 = pd.read_csv('data/ADNI-DIAN_Comparison_Study_Data_Subset_05_23_22.csv')
    df2 = pd.read_csv('data/ADASSCORES.csv')

    data = df1.merge(df2, on=['RID', 'EXAMDATE'], how='right')

    if filters:
        for selector in filters.split(','):
            selector = selector.replace(' ', '')

            comparator_index = selector.find('=')
            if '<' in selector:
                comparator_index = selector.index('<')
            if '>' in selector:
                comparator_index = selector.index('>')

            selector = f'data[\'{selector[:comparator_index]}\']{selector[comparator_index:]}'
            data = data[eval(selector)]

    if cols:
        data = data[cols]
        data = data.dropna(axis=0)

    data = data.head(limit)
    data = data.sort_values(by=cols[0])

    return Response(data.to_json(orient='records'), media_type="application/json")
