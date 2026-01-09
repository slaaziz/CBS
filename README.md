# CBS Dashboard

Project files for the matching model.

## File Overview

| File | Description |
| :--- | :--- |
| **`final_balanced_training_set.csv`** | **Start Here.** The master training file. Contains cleaned positives + hard negatives (1:1 ratio). Includes Dutch similarity scores (`content_similarity`) and legacy metadata (`date_binary`, etc.).  Also includes negatives, but as of now they were randomly picked and are not that good.|
| **`rf_models.ipynb`** | Training notebook. Runs the A/B test between the English baseline and the Dutch model. |
| **`fixed_preprocess.ipynb`** | Data generation script. Audits the raw data, calculates Spacy scores, and generates the training set. |

## Usage

1. **Training:**
   Open `rf_models.ipynb`. Ensure `final_balanced_training_set.csv` is in the root directory. Run all cells to train both models and save the `.pkl` files.

2. **Data Generation (Optional):**
   If you need to rebuild the dataset from raw files, run `fixed_preprocess.ipynb`. 
   *Note: Requires `data/` folder containing raw CSVs.*

**ANOTHER NOTE** all inital files provided by CBS were moved to `Legacy` folder. `final_trainset.csv` was renamed to `dataset_og.csv`. `dataset_modified.csv` is it's Dutch counterpart. Yet again **NOTE** that some of the entries present in `final_trainset.csv`, specifically the children files, are missing from the raw data files (thus they are handled as 0-s in the Dutch counterpart). Therefore, file `dataset_modified_cleaned.csv` drops the missing entries (0 value rows), and `dataset_og_cleaned.csv` drops corresponding entries as well. Finally, both are put into the final dataset, which currently keeps only moderate/high similarity entries as Positives, and adds random Negatives. It contains every entry with their Dutch and English score (among other information).
