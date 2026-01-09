# CBS Dashboard

Project files for the matching model.

## File Overview

| File | Description |
| :--- | :--- |
| **`final_balanced_training_set.csv`** | **Start Here.** The master training file. Contains cleaned positives + hard negatives (1:1 ratio). Includes Dutch similarity scores (`content_similarity`) and legacy metadata (`date_binary`, etc.). |
| **`rf_models.ipynb`** | Training notebook. Runs an A/B test between the English Baseline model (metadata-only) and the Fixed Dutch model (semantic scores). **Result:** Both models achieve >99% accuracy on this clean dataset. The English model is marginally higher (by 0.03%), but the Dutch model is preferred for robustness as it uses actual text analysis. |
| **`fixed_preprocess.ipynb`** | Data generation script. Audits the raw data, calculates Spacy scores, filters junk matches, and generates the training set. |

## Usage

1. **Training:**
   Open `rf_models.ipynb` (`final_balanced_training_set.csv` should be in the same directory). Run all cells to train both models, which saves their respective `.pkl` files.

2. **Data:**
   If you need to rebuild the dataset from raw files, run `fixed_preprocess.ipynb`. Do this at your own discretion though, as both Dutch-ifying data and picking/scoring negatives is CPU-intensive and takes hours. 
   *Note: Requires `data/` folder containing raw CSVs.*

## Legacy & Data Notes

* **Legacy Migration:** All initial files provided by CBS were moved to the `Legacy` folder. 
* **Renaming:** The original `final_trainset.csv` was renamed to `dataset_og.csv`. Its new Dutch counterpart is `dataset_modified.csv`.
* **Missing Data Logic:** Some children files referenced in the original list are missing from the raw data. These result in `0` scores in the Dutch processing.
    * **`dataset_modified_cleaned.csv`**: Drops these missing entries (zeros) and low-quality matches (<0.4).
    * **`dataset_og_cleaned.csv`**: Drops the corresponding rows from the original dataset so we can compare apples to apples.
    * **Merge:** Both cleaned files are merged into `final_balanced_training_set.csv`. This final file keeps only the moderate/high similarity entries as Positives and adds Negatives, which are randomly selected but then fully scored using Spacy. This creates a dataset where every entry, match or not, has valid Dutch scores and English metadata.

Model A – Initial baseline
	•	TF-IDF similarity + Random Forest
	•	English-oriented preprocessing
	•	Problems: Dutch text handled poorly, ID mismatches, missing files caused fake 0-scores

Model B – Fixed Dutch baseline (current reference)
	•	Dutch NLP using spaCy (nl_core_news_sm)
	•	Lemmatization enabled
	•	Rows removed if raw text files were missing (“ghost rows”)
	•	Clean similarity features
	•	Random Forest trained on valid Dutch text

Model B is the official baseline for comparison.

Next step (ongoing): Model C
The Random Forest baseline will be replaced by a modern retrieval pipeline:
	•	ColBERT (neural search)
	•	Hybrid search (BM25 + ColBERT)
	•	Cross-encoder reranking

⸻

Important files
	•	cleaned_initial.csv – Output of Model A (kept for comparison)
	•	cleaned_fixed.csv – Cleaned and validated dataset (use this)
	•	fixed_preprocess.ipynb – Core preprocessing and data fixes
	•	cleaned_model_fixed.ipynb – Trains Model B
	•	rf_training_eval_step.ipynb – Training & evaluation logic

⸻

Data note:
Raw data files are not in this repo due to size.
All experiments must use the same IDs as in cleaned_fixed.csv.

⸻

Setup:
pip install -r requirements.txt
python -m spacy download nl_core_news_sm

⸻

Notes
	•	Do not commit raw data or model files
	•	Treat cleaned_fixed.csv as the source of truth