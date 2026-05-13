from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import datasets, analytics

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AstralInsight Analytics API",
    description="AI-powered business analytics and forecasting engine",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(datasets.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    """API health check."""
    return {
        "status": "online",
        "service": "AstralInsight Analytics API",
        "version": "1.0.0",
        "endpoints": {
            "datasets": "/api/datasets",
            "analytics": "/api/analytics",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
