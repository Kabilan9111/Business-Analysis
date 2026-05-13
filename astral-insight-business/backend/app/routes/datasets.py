from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.database_models import Dataset, DataRecord
from app.models.schemas import DatasetSchema
from app.services.data_processing import DataProcessingService
import os
from datetime import datetime

router = APIRouter(prefix="/api/datasets", tags=["datasets"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and process a CSV or XLSX file."""
    try:
        # Validate file type
        file_type = file.filename.split('.')[-1].lower()
        if file_type not in ['csv', 'xlsx', 'xls']:
            raise HTTPException(status_code=400, detail="Only CSV and XLSX files are supported")
        
        # Save file
        file_path = os.path.join(UPLOAD_DIR, f"{datetime.now().timestamp()}_{file.filename}")
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # Parse file
        df = DataProcessingService.parse_file(file_path, file_type)
        
        # Detect schema
        schema_map = DataProcessingService.detect_schema(df)
        
        # Validate data
        validation = DataProcessingService.validate_dataset(df)
        
        # Store dataset metadata
        dataset = Dataset(
            name=file.filename,
            file_type=file_type,
            row_count=validation['total_rows'],
            column_names=list(df.columns),
            schema_map=schema_map,
            processing_status="processed",
            file_path=file_path,
            missing_values_count=validation['missing_values'],
            duplicate_rows=validation['duplicate_rows'],
            data_quality_score=validation['data_quality_score']
        )
        db.add(dataset)
        db.commit()
        db.refresh(dataset)
        
        # Store data records
        records = DataProcessingService.convert_to_dict(df)
        for record in records:
            data_record = DataRecord(dataset_id=dataset.id, data=record)
            db.add(data_record)
        db.commit()
        
        return {
            'status': 'success',
            'dataset_id': dataset.id,
            'filename': file.filename,
            'row_count': validation['total_rows'],
            'column_count': validation['total_columns'],
            'schema_detected': schema_map,
            'data_quality_score': validation['data_quality_score'],
            'missing_values': validation['missing_values'],
            'duplicate_rows': validation['duplicate_rows']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_datasets(db: Session = Depends(get_db)):
    """List all uploaded datasets."""
    datasets = db.query(Dataset).all()
    return [{
        'id': d.id,
        'name': d.name,
        'file_type': d.file_type,
        'row_count': d.row_count,
        'upload_timestamp': d.upload_timestamp,
        'data_quality_score': d.data_quality_score
    } for d in datasets]

@router.get("/{dataset_id}")
async def get_dataset(dataset_id: int, db: Session = Depends(get_db)):
    """Get dataset metadata."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    return {
        'id': dataset.id,
        'name': dataset.name,
        'file_type': dataset.file_type,
        'row_count': dataset.row_count,
        'column_names': dataset.column_names,
        'schema_map': dataset.schema_map,
        'upload_timestamp': dataset.upload_timestamp,
        'data_quality_score': dataset.data_quality_score
    }

@router.get("/{dataset_id}/preview")
async def preview_dataset(dataset_id: int, limit: int = 10, db: Session = Depends(get_db)):
    """Get dataset preview (first N rows)."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    records = db.query(DataRecord).filter(DataRecord.dataset_id == dataset_id).limit(limit).all()
    return {
        'dataset_id': dataset_id,
        'column_names': dataset.column_names,
        'rows': [r.data for r in records],
        'total_rows': dataset.row_count
    }
