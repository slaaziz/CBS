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

* **Legacy Migration:** All initial files provided by CBS were moved to the `Legacy` folder to preserve the baseline system state. They include:
   * **`preprocessing_project_functions.py`**: The initial version of the preprocessing pipeline, containing core definitions for text cleaning, stopword removal, and keyword extraction.
   * **`process_taxonomie.py`**: A utility script used to parse and structure the CBS taxonomy headers into a machine-readable format.
   * **`final_project_functions.py`**: An updated utility script containing the primary logic for text normalization and legacy Jaccard similarity calculations used in the baseline model.
   * **`trainset2.py`**: The script responsible for generating training pairs by utilizing the recordlinkage library and structural blocking.
   * **`project_variables.py`**: A configuration file storing hardcoded directory paths and global settings specific to the CBS server environment.
   * **`taxonomie_df.csv`**: The master list of 5,010 CBS categories and "Parent" articles used as the ground truth for matching.
* **Renaming:** The original `final_trainset.csv` was renamed to `dataset_og.csv`. Its new Dutch counterpart is `dataset_modified.csv`.
* **Missing Data Logic:** Some children files referenced in the original list are missing from the raw data. These result in `0` scores in the Dutch processing.
    * **`dataset_modified_cleaned.csv`**: Drops these missing entries (zeros) and low-quality matches (<0.4).
    * **`dataset_og_cleaned.csv`**: Drops the corresponding rows from the original dataset so we can compare apples to apples.
    * **Merge:** Both cleaned files are merged into `final_balanced_training_set.csv`. This final file keeps only the moderate/high similarity entries as Positives and adds Negatives, which are randomly selected but then fully scored using Spacy. This creates a dataset where every entry, match or not, has valid Dutch scores and English metadata.
 

## ABC Models

### Model A – Initial baseline
- TF-IDF similarity + Random Forest
- English-oriented preprocessing
- Known issues:
  - Poor handling of Dutch text
  - ID mismatches
  - Missing raw files caused artificial 0-scores

---

### Model B – Fixed Dutch baseline (current reference)
- Dutch NLP using spaCy (`nl_core_news_sm`)
- Lemmatization enabled
- Rows removed if raw text files were missing (“ghost rows”)
- Clean semantic similarity features
- Random Forest trained on valid Dutch text

**Model B is the official baseline for comparison.**

---

### Model C – Retrieval + neural verification (implemented)
Model C replaces the Random Forest classifier with a retrieval-based pipeline

**Implemented components**
- **BM25 retrieval**
  - Generates a shortlist of candidate news articles per CBS dataset
- **Neural cross-encoder reranking**
  - Jointly reads the CBS dataset text and each candidate article
  - Produces a relevance score per (dataset, article) pair
- **Decision threshold**
  - Converts the relevance score into a binary prediction:
    - *uses CBS data* (YES / NO)

**Output**
- Predictions are stored as CSV files (e.g. `model_c_predictions_0.5.csv`)
- Filenames explicitly include the threshold value
- This:
  - avoids recomputation
  - supports comparison across thresholds
  - allows results to be shared without rerunning the model

**Planned extensions (future work)**
- **ColBERT neural retrieval**
  - Improves recall for paraphrased or weakly lexical matches
- **Hybrid retrieval (BM25 + ColBERT)**
  - Uses Reciprocal Rank Fusion (RRF)
- **Threshold calibration**
  - Optimizes precision–recall trade-offs using validation data






