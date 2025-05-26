from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Protests API")

# Allow all origins (for dev purposes) so that React frontend (different port) can fetch the data
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://31.129.48.166",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hard-coded data derived from the spreadsheet (dates converted to ISO-8601 format)
DATA = [
    {"date": "2025-05-26", "serbia": 30, "georgia": 9},
    {"date": "2025-05-19", "serbia": 27, "georgia": 8},
    {"date": "2025-05-12", "serbia": 25, "georgia": 13},
    {"date": "2025-05-05", "serbia": 39, "georgia": 9},
    {"date": "2025-04-28", "serbia": 25, "georgia": 11},
    {"date": "2025-04-14", "serbia": 25, "georgia": 13},
    {"date": "2025-04-14", "serbia": 51, "georgia": 15},
    {"date": "2025-04-07", "serbia": 69, "georgia": 13},
    {"date": "2025-03-31", "serbia": 77, "georgia": 13},
    {"date": "2025-03-24", "serbia": 64, "georgia": 14},
    {"date": "2025-03-17", "serbia": 77, "georgia": 12},
    {"date": "2025-03-10", "serbia": 95, "georgia": 23},
    {"date": "2025-03-03", "serbia": 99, "georgia": 14},
    {"date": "2025-02-24", "serbia": 102, "georgia": 19},
    {"date": "2025-02-17", "serbia": 101, "georgia": 22},
    {"date": "2025-02-10", "serbia": 146, "georgia": 22},
    {"date": "2025-02-03", "serbia": 193, "georgia": 25},
    {"date": "2025-01-27", "serbia": 167, "georgia": 35},
    {"date": "2025-01-20", "serbia": 90, "georgia": 27},
    {"date": "2025-01-13", "serbia": 36, "georgia": 23},
    {"date": "2025-01-06", "serbia": 27, "georgia": 20},
    {"date": "2024-12-30", "serbia": 42, "georgia": 40},
]

# Unemployment data (percentage) per quarter — period format: YYYY-Q where Q is 1..4
UNEMPLOYMENT = [
    {"period": "2025-1", "georgia": 14.7, "serbia": 8.7},
    {"period": "2024-4", "georgia": 14.2, "serbia": 8.6},
    {"period": "2024-3", "georgia": 13.8, "serbia": 8.1},
    {"period": "2024-2", "georgia": 13.7, "serbia": 8.2},
    {"period": "2024-1", "georgia": 14.0, "serbia": 9.4},
    {"period": "2023-4", "georgia": 15.3, "serbia": 9.1},
    {"period": "2023-3", "georgia": 15.6, "serbia": 9.0},
    {"period": "2023-1", "georgia": 16.7, "serbia": 9.6},
    {"period": "2022-4", "georgia": 18.0, "serbia": 10.1},
    {"period": "2022-3", "georgia": 16.1, "serbia": 9.4},
    {"period": "2022-2", "georgia": 15.6, "serbia": 9.0},
    {"period": "2022-1", "georgia": 18.1, "serbia": 8.9},
    {"period": "2021-4", "georgia": 19.4, "serbia": 10.9},
    {"period": "2021-3", "georgia": 19.0, "serbia": 9.9},
    {"period": "2021-2", "georgia": 19.5, "serbia": 9.9},
    {"period": "2021-1", "georgia": 22.1, "serbia": 10.6},
    {"period": "2020-4", "georgia": 21.9, "serbia": 11.3},
    {"period": "2020-3", "georgia": 20.4, "serbia": 12.9},
    {"period": "2020-2", "georgia": 17.0, "serbia": 10.7},
    {"period": "2020-1", "georgia": 18.3, "serbia": 9.8},
    {"period": "2019-4", "georgia": 18.3, "serbia": 7.9},
    {"period": "2019-3", "georgia": 16.6, "serbia": 10.5},
    {"period": "2019-2", "georgia": 16.8, "serbia": 10.4},
    {"period": "2019-1", "georgia": 17.3, "serbia": 10.3},
]

# GDP per capita (PPP, thousand USD) data per year
GDP_PPP = [
    {"year": 2024, "georgia": 23.6, "serbia": 26.3},
    {"year": 2023, "georgia": 22.6, "serbia": 25.7},
    {"year": 2022, "georgia": 21.0, "serbia": 24.6},
    {"year": 2021, "georgia": 18.9, "serbia": 23.4},
    {"year": 2020, "georgia": 17.0, "serbia": 21.5},
    {"year": 2019, "georgia": 18.2, "serbia": 21.5},
    {"year": 2018, "georgia": 17.2, "serbia": 20.4},
    {"year": 2017, "georgia": 16.2, "serbia": 19.4},
    {"year": 2016, "georgia": 15.4, "serbia": 18.9},
    {"year": 2015, "georgia": 14.9, "serbia": 18.2},
    {"year": 2014, "georgia": 14.5, "serbia": 17.9},
    {"year": 2013, "georgia": 13.9, "serbia": 18.2},
    {"year": 2012, "georgia": 11.1, "serbia": 15.5},
    {"year": 2011, "georgia": 9.5, "serbia": 15.3},
    {"year": 2010, "georgia": 8.7, "serbia": 14.3},
]

# Net migration (persons) data per year (positive means inflow)
MIGRATION = [
    {"year": 2024, "georgia": 1745, "serbia": -8132},
    {"year": 2023, "georgia": 2003, "serbia": 4348},
    {"year": 2022, "georgia": 26999, "serbia": 40118},
    {"year": 2021, "georgia": -2738, "serbia": -8974},
    {"year": 2020, "georgia": -2738, "serbia": -10220},
    {"year": 2019, "georgia": -5412, "serbia": -18891},
    {"year": 2018, "georgia": -5176, "serbia": -18883},
    {"year": 2017, "georgia": -7889, "serbia": -18651},
    {"year": 2016, "georgia": -10588, "serbia": -18322},
    {"year": 2015, "georgia": -13321, "serbia": -18789},
    {"year": 2014, "georgia": -16047, "serbia": -18246},
    {"year": 2013, "georgia": -40117, "serbia": -17866},
    {"year": 2012, "georgia": -39920, "serbia": -18513},
    {"year": 2011, "georgia": -37847, "serbia": 611},
    {"year": 2010, "georgia": -36608, "serbia": 3632},
]

GINI = [
    {"year": 2024, "georgia": 33.5, "serbia": 32.0},
    {"year": 2023, "georgia": 33.5, "serbia": 32.0},
    {"year": 2022, "georgia": 33.5, "serbia": 32.0},
    {"year": 2021, "georgia": 34.2, "serbia": 33.1},
    {"year": 2020, "georgia": 34.5, "serbia": 35.0},
    {"year": 2019, "georgia": 35.9, "serbia": 34.5},
    {"year": 2018, "georgia": 36.4, "serbia": 35.0},
    {"year": 2017, "georgia": 37.9, "serbia": 36.2},
    {"year": 2016, "georgia": 36.6, "serbia": 38.8},
    {"year": 2015, "georgia": 36.5, "serbia": 40.5},
    {"year": 2014, "georgia": 37.6, "serbia": 40.5},
    {"year": 2013, "georgia": 38.6, "serbia": 39.5},
    {"year": 2012, "georgia": 39.0, "serbia": 39.5},
    {"year": 2011, "georgia": 39.6, "serbia": 39.5},
    {"year": 2010, "georgia": 39.5, "serbia": 38.9},
]


@app.get("/protests", summary="Get protests time-series data")
async def get_protests():
    """Return the protests data as a list of records sorted by date descending."""
    # Already in descending order; send as-is
    return DATA


@app.get("/unemployment", summary="Get unemployment data per quarter")
async def get_unemployment():
    """Return unemployment percentage data (list sorted by period descending)."""
    return UNEMPLOYMENT


@app.get("/gdp_ppp", summary="Get GDP per capita (PPP) per year")
async def get_gdp_ppp():
    """Return GDP per capita PPP data (list sorted by year descending)."""
    return GDP_PPP


@app.get("/migration", summary="Get net migration data per year")
async def get_migration():
    """Return net migration data (list sorted by year descending)."""
    return MIGRATION


@app.get("/api/gini", summary="Get Gini index per year")
async def get_gini():
    """Return Gini index data (list sorted by year descending)."""
    return GINI


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
