# CBS Media Monitoring Dashboard

Modernizing the CBS article-linking pipeline by replacing legacy lexical heuristics with a high-precision Dutch semantic vector space model.

**[Data Access (OneDrive)](https://amsuni-my.sharepoint.com/:f:/g/personal/rezi_getsadze_student_uva_nl/IgCfw2IuixE6Q5sF5awolVqIAUL91e2MVvGQp3EB6e9-xO0?e=bZj43V):** Raw article corpus and CSVs.

The main model (Phase 2 Overhaul) is a ground-up reconstruction of the system designed to eliminate "lazy" matching. It features a file-stitching pipeline to unify 350,000+ files and uses 300-dimensional spaCy Dutch embeddings. By implementing Hard Negative logic (pairing unrelated same-day articles), it breaks the original model's dependency on publication dates, achieving a major jump in precision.

### Core Production
| File | Purpose |
| :--- | :--- |
| **`rf_models_reconstructed.ipynb`** | **Main entry point.** Runs A/B tests and Error Analysis. |
| **`trainset_reconstructed.csv`** | Re-engineered master training set (300-d vectors + Hard Negatives). |
| **`new_preprocess.ipynb`** | The engine. Stitches 350k+ raw files and calculates spaCy vectors. |
| **`model_rf_fixed.pkl`** | Serialized production model (Model B) for dashboard integration. |

### Extended Modules
* **`network_graph.ipynb`**: Interactive relationship map (generates `family_cluster.html`).
* **`model_C.ipynb`**: Advanced neural retrieval prototype (BM25 + Cross-Encoders).
* **`lib/`**: [RACHNA: INSERT REACT FRONTEND REPO/FILES HERE].
* **`/Legacy/`**: Original CBS baseline scripts, functions, and taxonomy files preserved for comparison.
* **`/Old Preprocessing/`**: Audit trail containing Phase 1 scripts that identified Jaccard metric errors and English-stemming bias in the original data.

### Environment Setup
```bash
pip install -r requirements.txt
python -m spacy download nl_core_news_lg
```
## Model Comparison

| Model | Approach | Status | Key Improvements |
| :--- | :--- | :--- | :--- |
| **Original Model (A0)** | Initial Baseline | **Flawed** | Legacy code provided by CBS; contained Jaccard metric errors and English-stemming bias. |
| **Model A1** | Fixed Baseline | **Phase 1 Fix** | Corrected the asymmetric metric logic and fixed Dutch stemming on the provided masterlist. |
| **Model B1** | Initial Semantic | **Phase 1 Fix** | Replaced character-matching with spaCy vectors to solve "lexical blindness" on audited data. |
| **Model A2** | Reconstructed Lexical | **Phase 2 Overhaul** | Legacy features applied to the full 350k corpus with 1:1 Hard Negative sampling to break date-bias. |
| **Model B2** | **Production Semantic** | **Phase 2 Overhaul** | Final production model. Combines Dutch embeddings with Hard Negative mining for maximum precision. |

### `/Legacy/`
The baseline environment as originally received. These files are preserved for comparison.

* **`final_project_functions.py` / `preprocessing_project_functions.py`**: Legacy scripts containing the different Jaccard implementation.
* **`trainset2.py` / `final_trainset.csv`**: The original training generation logic and the resulting biased dataset.
* **`rf_training_eval_step.ipynb`**: The original notebook used to report the baseline 93% accuracy.
* **`taxonomie_df.csv`**: The master list of 5,010 categories used for legacy keyword lookup.

### `/old_preprocessing/` (Phase 1 Audit)
This folder contains the technical audit that proved the original system was link-matching based on date rather than text.

* **`fixed_preprocess.ipynb`**: The initial fix script that re-calculated similarity scores for the existing masterlist using spaCy (still based on provided trainset).
* **`match_verification.ipynb`**: A manual audit tool that compares raw data titles to verify that trainset contains positives.
* **`final_balanced_training_set.csv`**: The first iteration of a sanitized training set, used for Models A1 and B1.

## Network Graph - `network_graph.ipynb`
* **Global View:** Displays macroscopic clustering of the entire CBS media ecosystem.
* **Family Clusters:** Provides a microscopic view of individual articles and their related reports.
* **Logic:** Nodes are color-coded by confidence (Green > 0.88, Yellow 0.5-0.88). It uses a Barnes-Hut physics engine to allow analysts to physically manipulate and explore connections between reports.

## Reproducibility & Environment
* **Python Version:** 3.13
* **Random Seed:** `random_state=42` used across all notebook initializations (the answer to life, the universe, and everything).
* **Dependencies:** Refer to `requirements.txt`.
* **Hardware Note:** Preprocessing 350k+ files via `new_preprocess.ipynb` is memory-intensive. For the sanity of your hardware, utilize the pre-generated `trainset_reconstructed.csv` to bypass the stitching phase.
