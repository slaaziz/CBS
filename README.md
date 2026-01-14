# CBS Dashboard

Project files for the matching model.

## File Overview

| File | Description |
| :--- | :--- |
| **`trainset_reconstructed.csv`** | **Start Here.** The new master training file. Contains reconstructed matches + hard negatives (1:1 ratio). Includes Dutch similarity scores (`content_sim_dutch`) and the original legacy confidence scores (`%`). |
| **`rf_models_reconstructed.ipynb`** | Training notebook. Runs an A/B test between the Legacy Jaccard model and the New Dutch Vector model. **Result:** Both models achieve ~99% accuracy on the high-confidence subset. |
| **`new_preprocess.ipynb`** | Data generation script. Stitches the raw CSV files, calculates SpaCy vectors, applies the 2-day date window, and generates the `trainset_reconstructed.csv`. |

## Usage

1. **Training:**
   Open `rf_models_reconstructed.ipynb` (`trainset_reconstructed.csv` should be in the same directory). Run all cells to train both models.

2. **Note on data filtering:**
   The `trainset_reconstructed.csv` contains **all possible matches** (including low-confidence noise). To reproduce the high-accuracy results, you **must** filter for high-confidence matches (Legacy Score > 0.88) inside your notebook before training. Use this logic:
   ```python
   # Filter for 88% confidence (number Annemarie told us, but could be empirically changed)
   clean_positives = final_trainset[(final_trainset['match'] == 1) & (final_trainset['%'] >= 0.88)]
   # Keep all negatives (I sampled them negatively)
   clean_negatives = final_trainset[final_trainset['match'] == 0]

3. **Data Generation:**
   If you need to rebuild the dataset from raw files, run `new_preprocess.ipynb`.
   *Note: Requires `data/` folder containing raw CSVs.*

## Legacy Preprocessing - Fixing the existing code

* **Old Data Logic (Archived):** The following logic applied to the previous iteration of the project (files now moved to `old_preprocessing/`):
  * **Renaming:** The original `final_trainset.csv` was renamed to `dataset_og.csv`. Its new Dutch counterpart is `dataset_modified.csv`.
  * **Missing Data Logic:** Some children files referenced in the original list are missing from the raw data. These result in `0` scores in the Dutch processing.
    * **`dataset_modified_cleaned.csv`**: Drops these missing entries (zeros) and low-quality matches (<0.4).
    * **`dataset_og_cleaned.csv`**: Drops the corresponding rows from the original dataset so we can compare apples to apples.
    * **Merge:** Both cleaned files are merged into `final_balanced_training_set.csv`. This final file keeps only the moderate/high similarity entries as Positives and adds Negatives, which are randomly selected but then fully scored using Spacy.

## Legacy & Data Notes

* **Legacy Migration:** All initial files provided by CBS were moved to the `Legacy` folder to preserve the baseline system state. They include:
  * **`preprocessing_project_functions.py`**: The initial version of the preprocessing pipeline, containing core definitions for text cleaning, stopword removal, and keyword extraction.
  * **`process_taxonomie.py`**: A utility script used to parse and structure the CBS taxonomy headers into a machine-readable format.
  * **`final_project_functions.py`**: An updated utility script containing the primary logic for text normalization and legacy Jaccard similarity calculations used in the baseline model.
  * **`trainset2.py`**: The script responsible for generating training pairs by utilizing the recordlinkage library and structural blocking.
  * **`project_variables.py`**: A configuration file storing hardcoded directory paths and global settings specific to the CBS server environment.
  * **`taxonomie_df.csv`**: The master list of 5,010 CBS categories and "Parent" articles used as the ground truth for matching.

## ABC Models

### Model 0 - The nonexistent baseline - the original Legacy code provided, which had a lot of issues.

### Model A - Initial baseline (fixed version of Model 0)
- TF-IDF similarity + Random Forest
- English-oriented preprocessing
- Known issues:
  - Poor handling of Dutch text
  - ID mismatches (fixed)
  - Negative sampling (fixed)
  - Missing raw files caused artificial 0-scores (fixed by re-doing pre-processing)

---

### Model B - Fixed Dutch baseline (current reference)
- Dutch NLP using spaCy (`nl_core_news_lg`)
- Lemmatization enabled
- Rows removed if raw text files were missing (“ghost rows”)
- Clean semantic similarity features
- Random Forest trained on valid Dutch text

**Model B is the official baseline for comparison.**

---

### Model C - Retrieval + neural verification (implemented)
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
  - Optimizes precision-recall trade-offs using validation data
