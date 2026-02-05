#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
from treeinterpreter import treeinterpreter as ti
import argparse
import pickle
import sys

import pandas as pd
import recordlinkage
from recordlinkage.index import Full
import spacy
import numpy as np
import random
import warnings

from final_project_functions import preprocessing_child,\
                                preprocessing_parent,\
                                find_link,\
                                find_id,\
                                find_title,\
                                find_sleutelwoorden_UF,\
                                find_BT_TT,\
                                find_title_no_stop,\
                                find_1st_paragraph_no_stop,\
                                date_comparison,\
                                regex,\
                                find_numbers,\
                                remove_stopwords_from_content,\
                                similarity,\
                                remove_numbers,\
                                keep_only_words
from project_variables import project_path,\
                              all_parents_location
from pandas import Series
                      
match_zonder_model = 0
bestand_niet_gevonden = 0 

#Data met informatie over alle children
data_all_children = pd.read_csv('/home/sksa@cbsp.nl/Data afstudeerstage CBS/childs_from_id.csv')

#Data met informatie over alle parents uit het huidige model
data_all_parents = pd.read_csv('/home/sksa@cbsp.nl/Data afstudeerstage CBS/data/all_parents.csv') 

#childeren zonder parent worden apart gezet en uit de dataset 'data_all_children' gehaald
data_children_zonder_parent = data_all_children[data_all_children['related_parents'].isna()] 
data_all_children.dropna(subset = ['related_parents'],inplace = True)

#Bij de kolom 'related_parents' wordt tekst weggehaald, zodat alleen het id er in staat
data_all_children['related_parents'] = data_all_children['related_parents'].str.replace("[matches/]",'',  regex=True)

#children met meer dan één parents worden apart gezet
data_children_meer_dan_een_parent = data_all_children[data_all_children['related_parents'].str.contains(",")]
                                      
#children met één parent
list_data_children_meer_dan_een_parent = data_children_meer_dan_een_parent['related_parents'].tolist()
data_children_een_parent = data_all_children[~data_all_children['related_parents'].isin(list_data_children_meer_dan_een_parent)].reindex()
data_children_een_parent['related_parents'] = data_children_een_parent['related_parents'].astype(int)

#De dataset met alle children bevat alleen children die horen bij een parent dat een nieuwsbericht is
list_all_parents = data_all_parents['id'].tolist()
final_data_all_children = data_children_een_parent[data_children_een_parent['related_parents'].isin(list_all_parents)].reindex()

gespiltste_id = data_children_meer_dan_een_parent['related_parents'].str.split(',').apply(Series, 1).stack()
gespiltste_id.index = gespiltste_id.index.droplevel(-1)
gespiltste_id.name = 'related_parents'

del data_children_meer_dan_een_parent['related_parents']
data_children_meer_dan_een_parent = data_children_meer_dan_een_parent.join(gespiltste_id)

#kolom volgorde aanpassen, want het is nu aan het einde van de dataframe
data_children_meer_dan_een_parent_kolommen = data_children_meer_dan_een_parent.columns
data_children_meer_dan_een_parent_kolommen.tolist()
data_children_meer_dan_een_parent = data_children_meer_dan_een_parent[['copyright',
 'datasource_title',
 'reach',
 'external_parent_id',
 'program',
 'mom_2019_impact_score',
 'publish_date_date',
 'document_key',
 'publish_day',
 'full_text_link',
 'themes',
 'insert_date_date',
 'publication_issue_string',
 'source_string',
 'id',
 'program_string',
 'taxonomies_string',
 'press_conference_string',
 'datasource_type_title',
 'media_value',
 'surface',
 'tags',
 'taxonomies',
 'gatekeeper_key',
 'regional_data',
 'full_text_link_string',
 'publish_date',
 'authors',
 'publish_weekday',
 'external_id',
 'video_link_string',
 'phenomenon',
 'publish_month',
 'edition_string',
 'medium_category_string',
 'themes_string',
 'datasource_key',
 'word_count',
 'relevant_link',
 'social_profile_image',
 'reproductions',
 'departments',
 'departments_string',
 'graphic',
 'relevant_link_string',
 'import_id',
 'kamerstuk_reference_number',
 'publish_minute',
 'publication_calendar',
 'subject_string',
 'press_conference',
 'series',
 'spokesmen',
 'publish_year',
 'mig_page',
 'subject',
 'reference_string',
 'section',
 'source',
 'series_string',
 'reference',
 'related_parents',
 'datasource_theme',
 'publication',
 'tags_string',
 'publication_issue',
 'medium_category',
 'insert_date',
 'datasource_theme_string',
 'mom_impact_score',
 'video_link',
 'mig_title',
 'publisher',
 'page',
 'datasource_type_key',
 'medium_subcategory',
 'publication_string',
 'link',
 'publish_week',
 'edition',
 'medium',
 'video',
 'title',
 'content',
 'spokesmen_string',
 'duration',
 'section_string',
 'kamerstuk_reference_number_string',
 'related_parents_string',
 'medium_string',
 'related_children',
 'medium_subcategory_string',
 'publish_hour',
 'publisher_string',
 '_version_',
 'circulation',
 'authors_string',
 'embargo']]

alle_children =final_data_all_children

rij_id = alle_children['id']
rij_related_parents = alle_children['related_parents']

trainset = pd.concat([rij_id,rij_related_parents], axis=1, join='inner')
trainset = trainset.assign(match=1)

warnings.filterwarnings("ignore") #waarschuwingen die vaker voorkomen worden één keer weergegeven OF er worden helemeaal geen meldingen weergegeven?

path = Path(project_path)
modelpath = path / 'scripts'

wordvectorpath = path / 'model/nl_vectors_wiki_lg/'

#De functie spacy leest de pijplijnen, gebruikt de taal en pijplijninformatie om een language object (een verzameling 
#gegevens (variabelen) en methoden (functies)) te construeren, laadt de modelgegevens en gewichten in en retourneert deze.
#Hierdoor worden eigenlijk de geregistreerde functies in dit geval wordvectorpath beschikbaar gemaakt.
nlp = spacy.load(wordvectorpath)

trainset_geen_match = pd.DataFrame(columns = ['id','related_parents','match'])
uiteindelijke_df_match = pd.DataFrame()
uiteindelijke_df_match_zm = pd.DataFrame(columns = ['c','p','%','sleutelwoorden','BT_TT','titel','1st_para','getallen'])
uiteindelijke_df_geen_match = pd.DataFrame()
uiteindelijke_df_geen_match_zm = pd.DataFrame(columns = ['c','p','%','sleutelwoorden','BT_TT','titel','1st_para','getallen'])

for s in range(0,len(trainset)):
    print(s)
    list_all_children_trainset = trainset['id'].tolist()
    list_all_parents_trainset = trainset['related_parents'].tolist()
    child_id_trainset = trainset.iloc[s,0]
    
    def get_index_positions(list_of_elems, element):
        ''' Returns the indexes of all occurrences of give element in
        the list- listOfElements '''
        index_pos_list = []
        index_pos = 0
        while True:
            try:
                # Search for item in list from indexPos to the end of list
                index_pos = list_of_elems.index(element, index_pos)
                # Add the index position in list
                index_pos_list.append(index_pos)
                index_pos += 1
            except ValueError as e:
                break
        return index_pos_list
    
    index_pos_list = get_index_positions(list_all_children_trainset, child_id_trainset)
    
    list_opslaan_parents = []
    for z in index_pos_list:
        parent_horend_bij_child_id_trainset = trainset.iloc[z,1]
        list_opslaan_parents.append(parent_horend_bij_child_id_trainset)
        
    for g in list_opslaan_parents:
        if g in list_all_parents_trainset:
            list_all_parents_trainset.remove(g)
    
    random_num = random.choice(list_all_parents_trainset)

    list2=[{'id':child_id_trainset,'related_parents':random_num,'match':0}]
    df2 = pd.DataFrame(list2)
    trainset_geen_match= trainset_geen_match.append(df2, ignore_index=True)
        
    #---------------------------#
    # Reading and preprocessing #
    #---------------------------#
    #De child uit de argparse wordt gelezen uit de data en omgezet naar leesbare data (preprocessing)
    try:
     new_child = pd.read_csv(str('/data/home/sksa@cbsp.nl/Data afstudeerstage CBS/data/c_%s.csv' %(child_id_trainset)))#, index_col=0)
    except OSError:
        bestand_niet_gevonden = bestand_niet_gevonden + 1
        continue # or log it if needed.
    #new_child = pd.read_csv(str(path / ('data/c_%s.csv' %(child_id))))#, index_col=0)
    new_child = preprocessing_child(new_child)
    
    #FEATURES AFLEIDEN
    #Getallen worden uit de tekst opgehaald 
    #De kolom 'child_numbers' wordt toegevoegd aan de child database
    new_child.loc[:, 'child_numbers'] = new_child.apply(regex, args=('content', ), axis=1)
    #De inhoud wordt zonder getallen opgeslagen
    #De kolom 'content_no_numbers' wordt toegevoegd aan de child database
    new_child.loc[:, 'content_no_numbers'] = new_child.apply(remove_numbers, args=('content', ), axis=1)
    
    # Stopwoorden verwijderen uit de titel 
    #De kolom 'title_child_no_stop' wordt toegevoegd aan de child database
    new_child.loc[:, 'title_child_no_stop'] = new_child.apply(remove_stopwords_from_content, args=('title', ), axis=1)
    # Stopwoorden verwijderen uit de inhoud
    #De kolom 'content_child_no_stop' wordt toegevoegd aan de child database
    new_child.loc[:, 'content_child_no_stop'] = new_child.apply(remove_stopwords_from_content, args=('content_no_numbers', ), axis=1)
    
    # Het vinden van de CBS link in het 'child' artikel
    #De kolom 'cbs_link' wordt toegevoegd aan de child database
    new_child.loc[:, 'cbs_link'] = new_child.apply(find_link, axis=1)
    
    #Het inlezen van csv met alle parents (parent database)
    parents_dataset = pd.read_csv(str(path / all_parents_location), index_col=0)
    parent_horend_bij_child_id_trainset = int(parent_horend_bij_child_id_trainset)
    parents = parents_dataset.loc[parents_dataset['id']== parent_horend_bij_child_id_trainset] 
    parents = preprocessing_parent(parents) ####### Moet niet meer nodig zijn op het laatst
 
    #De publicatiedatum van de parent wordt omgezet naar datetime formaat. 
    #Hierdoor wordt het daadwerkelijk ook herkend als een datum.
    parents.loc[:, 'publish_date'] = pd.to_datetime(parents.loc[:, 'publish_date'])
    
    # Kolommen selecteren voor de parent en child
    parents = parents[['id',
                       'publish_date',
                       'title',
                       'content',
                       'link',
                       'taxonomies',
                       'Gebruik_UF',
                       'BT_TT',
                       'first_paragraph_without_stopwords',
                       'title_without_stopwords',
                       'content_without_stopwords',
                       'parent_numbers',
                       'related_children']]
    
    new_child = new_child[['id',
                           'publish_date',
                           'title',
                           'content',
                           'related_parents',
                           'title_child_no_stop',
                           'content_child_no_stop',
                           'child_numbers',
                           'cbs_link']]
    
    #---------------------------------------#
    # Feature creation and model prediction #
    #---------------------------------------#
    # Indexation step
    #Het maken van alle paren. Het doel hierbij is om duidelijke niet-overeenkomsten vanaf het begin uit te sluiten 
    #om de rekenefficiëntie te verbeteren. 
    #Recordkoppeling wordt gebruikt om gegevens uit meerdere databestanden te koppelen of om duplicaten in één databestand te vinden.
    #Doordat het een te groot bestand is wordt een object gemaakt die alleen de combinaties van recordnummers onthoudt.
    indexer = recordlinkage.Index()
    indexer.add(Full())
    candidate_links = indexer.index(parents, new_child)
    
    # Comparison step - creation of all possible matches
    #Er wordt een object genaamt compare aangemaakt. Hiermee wordt aangegeven hoeveel elk paar matcht.
    #Om de hoeveelheid van de match te berkenen wordt gebruik gemaakt van jarowinkler tussen de kolommen parents.link 
    #en new_child.cbs_link. de jarowinkeler geeft een maat 0 voor strings die totaal verschillend zijn en een 1 voor
    #strings die hetzelfde zijn
    compare_cl = recordlinkage.Compare()
    compare_cl.string('link', 'cbs_link', method='jarowinkler', threshold=0.93, label='feature_link_score')
    features = compare_cl.compute(candidate_links, parents, new_child)
    features.reset_index(inplace=True)
        

    # In het volgende blokje worden de al bestaande features van parents en child in een dataframe genaamd features gezet.
    features.loc[:, 'child_id'] = features.apply(find_id, args=(new_child, 'level_1'), axis=1)
    features.loc[:, 'parent_id'] = features.apply(find_id, args=(parents, 'level_0'), axis=1)
    features = features.merge(parents, left_on='parent_id', right_on='id', how='left')
    features = features.merge(new_child, left_on='child_id', right_on='id', how='left')
    features.drop(columns=['level_0', 'level_1', 'id_x', 'id_y'], inplace=True)
    features.rename(columns={'title_x': 'title_parent',
                             'content_x': 'content_parent',
                             'publish_date_x': 'publish_date_parent',
                             'title_y': 'title_child',
                             'content_y': 'content_child',
                             'publish_date_y': 'publish_date_child'}, inplace=True)
    
    #De dataframe features bestaat nu uit de volgende kolommen:
    # ['feature_link_score', 'child_id', 'parent_id', 'publish_date_parent', 'title_parent', 'content_parent', 'link',
    #  'taxonomies', 'Gebruik_UF', 'BT_TT', 'first_paragraph_without_stopwords', 'title_without_stopwords',
    #  'content_without_stopwords', 'parent_numbers', 'related_children', 'publish_date_child', 'title_child', 
    #  'content_child', 'related_parents', 'title_child_no_stop', 'content_child_no_stop', 'child_numbers', 'cbs_link']
    
    #-------------------------------#
    # Rules before the actual model #
    #-------------------------------#
    #Er worden nu van een aantal hele duidelijke gevallen de kans op een match zelf afgeleid. Dus niet met het gehele model.
    # Er wordt gecheckt of de gehele titel van het CBS-bericht overeenkomt met de titel van het mediabericht
    features['feature_whole_title'] = features.apply(find_title, axis=1)
    
    #Als de CBS link en de gehele titel met elkaar overeenkomen wordt de match kans gelijk aan 1
    if (features['feature_whole_title'].sum() > 0) | (features['feature_link_score'].sum() > 0):
        features['predicted_match'] = features['feature_whole_title'] + features['feature_link_score']
        #De resultaten worden gesorteerd
        features.sort_values(by=['predicted_match'], ascending=False, inplace=True)
    
        #Final DF
        to_return = features[['child_id', 'parent_id', 'predicted_match']]
        to_return['predicted_match'] = to_return['predicted_match'].clip(0, 1)
        for column in 'sleutelwoorden_matches','BT_TT_matches','title_no_stop_matches','1st_paragraph_no_stop_matches','numbers_matches':
            to_return.loc[:,column] = ['']    
        to_return.loc[:, 'predicted_match'] = to_return[['predicted_match']].applymap("{0:.4f}".format)
        
        to_return.columns = ['c','p','%','sleutelwoorden','BT_TT','titel','1st_para','getallen']
        uiteindelijke_df_match_zm = uiteindelijke_df_match_zm.append(to_return, ignore_index=True)
        match_zonder_model = match_zonder_model +1
        continue
    
    #-------------------------------------------------------------#
    # No match on pre-model rules? Continue with feature creation #
    #-------------------------------------------------------------#
    #Is er geen match van 1 op basis van de titels en de link? Dan gaat het script door.
    #Er wordt een reeks van features afgeleid.
    
    #Er wort gecheckt op CBS sleutelwoorden en synoniemen.
    #Dit wordt bijgehouden op 3 manieren in de drie kolommen genaamd: 'sleutelwoorden_jaccard', 
    #'sleutelwoorden_lenmatches' en 'sleutelwoorden_matches' dmv de functie find_sleutelwoorden_uf
    features[['sleutelwoorden_jaccard', 'sleutelwoorden_lenmatches', 'sleutelwoorden_matches']] = features.apply(find_sleutelwoorden_UF, axis=1)
    features.loc[features['taxonomies'].isnull(), ['sleutelwoorden_jaccard', 'sleutelwoorden_lenmatches']] = 0
    
    #Het controleren van bredere termen en toptermen op basis van de functie find_BT_TT.
    #De functie find_BT_TT geeft de jaccard score en het aantal matches op basis van de Broader Terms en Top Terms van de
    #sleutelwoorden
    #Dit wordt bijgehouden in de drie kolommen genaamd 'BT_TT_jaccard', 'BT_TT_lenmatches' en 'BT_TT_matches'
    features[['BT_TT_jaccard', 'BT_TT_lenmatches', 'BT_TT_matches']] = features.apply(find_BT_TT, axis=1)
    features.loc[features['BT_TT'].isnull(), ['BT_TT_jaccard', 'BT_TT_lenmatches']] = 0
    
    # De CBS titel checken zonder stopwoorden
    features[['title_no_stop_jaccard', 'title_no_stop_lenmatches', 'title_no_stop_matches']] = features.apply(find_title_no_stop, axis=1)
    
    
    #De eerste paragraaf van het CBS-bericht wordt gecheckt zonder stopwoorden (in 3 kolommen bijgehouden)
    features[['1st_paragraph_no_stop_jaccard', '1st_paragraph_no_stop_lenmatches', '1st_paragraph_no_stop_matches']] = features.apply(find_1st_paragraph_no_stop, axis=1)
    features.loc[features['first_paragraph_without_stopwords'].isnull(), ['1st_paragraph_no_stop_jaccard', '1st_paragraph_no_stop_lenmatches']] = 0
    
    #Het verschil tussen de publicatiedatum van het CBS-bericht en mediabericht wordt berekend.
    features['date_diff_days'] = abs(features['publish_date_parent']-features['publish_date_child']).dt.days.astype(float)
    offset = 0
    scale = 7
    features['date_diff_score'] = features.apply(date_comparison, args=(offset, scale), axis=1)
    
    # Alle CBS nummers checken
    features[['numbers_jaccard', 'numbers_lenmatches', 'numbers_matches']] = features.apply(find_numbers, axis=1)
    
    #Een similarity maat tussen titels, en een similarity maat tussen de volledige inhoud van parents en child
    features[['title_similarity', 'content_similarity']] = features.apply(similarity, args=(nlp, ), axis=1)
    
    #De jaccard scores van hierboven worden bij elkaar opgeteld tot een eindscore
    features['jac_total'] = features['sleutelwoorden_jaccard']+\
                     features['BT_TT_jaccard']+\
                     features['title_no_stop_jaccard']+\
                     features['1st_paragraph_no_stop_jaccard']+\
                     features['numbers_jaccard']
    
    # Incorrectly assumes that if dates are close (< 2 days), it is a match.
    # CAUSE OF ERROR: High rate of False Positives (Date Bias).
    features.loc[features['date_diff_days'] < 2, 'date_binary'] = 1
    features.loc[features['date_diff_days'] >= 2, 'date_binary'] = 0
    
    features['match'] = 1
    
    feature_cols = ['child_id',
                    'parent_id',
                    'match',
                    'date_binary',
                    'jac_total',
                    'title_similarity',
                    'content_similarity',
                    'sleutelwoorden_lenmatches',
                    'BT_TT_lenmatches',
                    'title_no_stop_lenmatches',
                    '1st_paragraph_no_stop_lenmatches',
                    'numbers_lenmatches']

    to_predict = features[feature_cols]
    to_predict = to_predict.fillna(0)

    uiteindelijke_df_match = uiteindelijke_df_match.append(to_predict, ignore_index=True)
    
for s in range(0,len(trainset_geen_match)):
    print(s)
    child_id_trainset = trainset_geen_match.iloc[s,0]
    parent_horend_bij_child_id_trainset = trainset_geen_match.iloc[s,1]

    #---------------------------#
    # Reading and preprocessing #
    #---------------------------#
    #De child uit de argparse wordt gelezen uit de data en omgezet naar leesbare data (preprocessing)
    try:
     new_child = pd.read_csv(str('/data/home/sksa@cbsp.nl/Data afstudeerstage CBS/data/c_%s.csv' %(child_id_trainset)))#, index_col=0)
    except OSError:
        bestand_niet_gevonden = bestand_niet_gevonden + 1
        continue # or log it if needed.
    #new_child = pd.read_csv(str(path / ('data/c_%s.csv' %(child_id))))#, index_col=0)
    new_child = preprocessing_child(new_child)
    
    #FEATURES AFLEIDEN
    #Getallen worden uit de tekst opgehaald 
    #De kolom 'child_numbers' wordt toegevoegd aan de child database
    new_child.loc[:, 'child_numbers'] = new_child.apply(regex, args=('content', ), axis=1)
    #De inhoud wordt zonder getallen opgeslagen
    #De kolom 'content_no_numbers' wordt toegevoegd aan de child database
    new_child.loc[:, 'content_no_numbers'] = new_child.apply(remove_numbers, args=('content', ), axis=1)
    
    # Stopwoorden verwijderen uit de titel 
    #De kolom 'title_child_no_stop' wordt toegevoegd aan de child database
    new_child.loc[:, 'title_child_no_stop'] = new_child.apply(remove_stopwords_from_content, args=('title', ), axis=1)
    # Stopwoorden verwijderen uit de inhoud
    #De kolom 'content_child_no_stop' wordt toegevoegd aan de child database
    new_child.loc[:, 'content_child_no_stop'] = new_child.apply(remove_stopwords_from_content, args=('content_no_numbers', ), axis=1)
    
    # Het vinden van de CBS link in het 'child' artikel
    #De kolom 'cbs_link' wordt toegevoegd aan de child database
    new_child.loc[:, 'cbs_link'] = new_child.apply(find_link, axis=1)
    
    #Het inlezen van csv met alle parents (parent database)
    parents_dataset = pd.read_csv(str(path / all_parents_location), index_col=0)
    parent_horend_bij_child_id_trainset = int(parent_horend_bij_child_id_trainset)
    parents = parents_dataset.loc[parents_dataset['id']== parent_horend_bij_child_id_trainset] 
    parents = preprocessing_parent(parents) ####### Moet niet meer nodig zijn op het laatst
     
    #De publicatiedatum van de parent wordt omgezet naar datetime formaat. 
    #Hierdoor wordt het daadwerkelijk ook herkend als een datum.
    parents.loc[:, 'publish_date'] = pd.to_datetime(parents.loc[:, 'publish_date'])
    
    # Kolommen selecteren voor de parent en child
    parents = parents[['id',
                       'publish_date',
                       'title',
                       'content',
                       'link',
                       'taxonomies',
                       'Gebruik_UF',
                       'BT_TT',
                       'first_paragraph_without_stopwords',
                       'title_without_stopwords',
                       'content_without_stopwords',
                       'parent_numbers',
                       'related_children']]
    
    new_child = new_child[['id',
                           'publish_date',
                           'title',
                           'content',
                           'related_parents',
                           'title_child_no_stop',
                           'content_child_no_stop',
                           'child_numbers',
                           'cbs_link']]
    
    #---------------------------------------#
    # Feature creation and model prediction #
    #---------------------------------------#
    # Indexation step
    #Het maken van alle paren. Het doel hierbij is om duidelijke niet-overeenkomsten vanaf het begin uit te sluiten 
    #om de rekenefficiëntie te verbeteren. 
    #Recordkoppeling wordt gebruikt om gegevens uit meerdere databestanden te koppelen of om duplicaten in één databestand te vinden.
    #Doordat het een te groot bestand is wordt een object gemaakt die alleen de combinaties van recordnummers onthoudt.
    indexer = recordlinkage.Index()
    indexer.add(Full())
    candidate_links = indexer.index(parents, new_child)
    
    # Comparison step - creation of all possible matches
    #Er wordt een object genaamt compare aangemaakt. Hiermee wordt aangegeven hoeveel elk paar matcht.
    #Om de hoeveelheid van de match te berkenen wordt gebruik gemaakt van jarowinkler tussen de kolommen parents.link 
    #en new_child.cbs_link. de jarowinkeler geeft een maat 0 voor strings die totaal verschillend zijn en een 1 voor
    #strings die hetzelfde zijn
    compare_cl = recordlinkage.Compare()
    compare_cl.string('link', 'cbs_link', method='jarowinkler', threshold=0.93, label='feature_link_score')
    features = compare_cl.compute(candidate_links, parents, new_child)
    features.reset_index(inplace=True)
        
    
    # In het volgende blokje worden de al bestaande features van parents en child in een dataframe genaamd features gezet.
    features.loc[:, 'child_id'] = features.apply(find_id, args=(new_child, 'level_1'), axis=1)
    features.loc[:, 'parent_id'] = features.apply(find_id, args=(parents, 'level_0'), axis=1)
    features = features.merge(parents, left_on='parent_id', right_on='id', how='left')
    features = features.merge(new_child, left_on='child_id', right_on='id', how='left')
    features.drop(columns=['level_0', 'level_1', 'id_x', 'id_y'], inplace=True)
    features.rename(columns={'title_x': 'title_parent',
                             'content_x': 'content_parent',
                             'publish_date_x': 'publish_date_parent',
                             'title_y': 'title_child',
                             'content_y': 'content_child',
                             'publish_date_y': 'publish_date_child'}, inplace=True)
    
    #De dataframe features bestaat nu uit de volgende kolommen:
    # ['feature_link_score', 'child_id', 'parent_id', 'publish_date_parent', 'title_parent', 'content_parent', 'link',
    #  'taxonomies', 'Gebruik_UF', 'BT_TT', 'first_paragraph_without_stopwords', 'title_without_stopwords',
    #  'content_without_stopwords', 'parent_numbers', 'related_children', 'publish_date_child', 'title_child', 
    #  'content_child', 'related_parents', 'title_child_no_stop', 'content_child_no_stop', 'child_numbers', 'cbs_link']
    
    #-------------------------------#
    # Rules before the actual model #
    #-------------------------------#
    #Er worden nu van een aantal hele duidelijke gevallen de kans op een match zelf afgeleid. Dus niet met het gehele model.
    # Er wordt gecheckt of de gehele titel van het CBS-bericht overeenkomt met de titel van het mediabericht
    features['feature_whole_title'] = features.apply(find_title, axis=1)
    
    #Als de CBS link en de gehele titel met elkaar overeenkomen wordt de match kans gelijk aan 1
    if (features['feature_whole_title'].sum() > 0) | (features['feature_link_score'].sum() > 0):
        features['predicted_match'] = features['feature_whole_title'] + features['feature_link_score']
        #De resultaten worden gesorteerd
        features.sort_values(by=['predicted_match'], ascending=False, inplace=True)
    
        #Final DF
        to_return = features[['child_id', 'parent_id', 'predicted_match']]
        to_return['predicted_match'] = to_return['predicted_match'].clip(0, 1)
        for column in 'sleutelwoorden_matches','BT_TT_matches','title_no_stop_matches','1st_paragraph_no_stop_matches','numbers_matches':
            to_return.loc[:,column] = ['']    
        to_return.loc[:, 'predicted_match'] = to_return[['predicted_match']].applymap("{0:.4f}".format)
        
        to_return.columns = ['c','p','%','sleutelwoorden','BT_TT','titel','1st_para','getallen']
        uiteindelijke_df_geen_match_zm = uiteindelijke_df_geen_match_zm(to_return, ignore_index=True)
        match_zonder_model = match_zonder_model +1
        continue
    
    #-------------------------------------------------------------#
    # No match on pre-model rules? Continue with feature creation #
    #-------------------------------------------------------------#
    #Is er geen match van 1 op basis van de titels en de link? Dan gaat het script door.
    #Er wordt een reeks van features afgeleid.
    
    #Er wort gecheckt op CBS sleutelwoorden en synoniemen.
    #Dit wordt bijgehouden op 3 manieren in de drie kolommen genaamd: 'sleutelwoorden_jaccard', 
    #'sleutelwoorden_lenmatches' en 'sleutelwoorden_matches' dmv de functie find_sleutelwoorden_uf
    features[['sleutelwoorden_jaccard', 'sleutelwoorden_lenmatches', 'sleutelwoorden_matches']] = features.apply(find_sleutelwoorden_UF, axis=1)
    features.loc[features['taxonomies'].isnull(), ['sleutelwoorden_jaccard', 'sleutelwoorden_lenmatches']] = 0
    
    #Het controleren van bredere termen en toptermen op basis van de functie find_BT_TT.
    #De functie find_BT_TT geeft de jaccard score en het aantal matches op basis van de Broader Terms en Top Terms van de
    #sleutelwoorden
    #Dit wordt bijgehouden in de drie kolommen genaamd 'BT_TT_jaccard', 'BT_TT_lenmatches' en 'BT_TT_matches'
    features[['BT_TT_jaccard', 'BT_TT_lenmatches', 'BT_TT_matches']] = features.apply(find_BT_TT, axis=1)
    features.loc[features['BT_TT'].isnull(), ['BT_TT_jaccard', 'BT_TT_lenmatches']] = 0
    
    # De CBS titel checken zonder stopwoorden
    features[['title_no_stop_jaccard', 'title_no_stop_lenmatches', 'title_no_stop_matches']] = features.apply(find_title_no_stop, axis=1)
    
    
    #De eerste paragraaf van het CBS-bericht wordt gecheckt zonder stopwoorden (in 3 kolommen bijgehouden)
    features[['1st_paragraph_no_stop_jaccard', '1st_paragraph_no_stop_lenmatches', '1st_paragraph_no_stop_matches']] = features.apply(find_1st_paragraph_no_stop, axis=1)
    features.loc[features['first_paragraph_without_stopwords'].isnull(), ['1st_paragraph_no_stop_jaccard', '1st_paragraph_no_stop_lenmatches']] = 0
    
    #Het verschil tussen de publicatiedatum van het CBS-bericht en mediabericht wordt berekend.
    features['date_diff_days'] = abs(features['publish_date_parent']-features['publish_date_child']).dt.days.astype(float)
    offset = 0
    scale = 7
    features['date_diff_score'] = features.apply(date_comparison, args=(offset, scale), axis=1)
    
    # Alle CBS nummers checken
    features[['numbers_jaccard', 'numbers_lenmatches', 'numbers_matches']] = features.apply(find_numbers, axis=1)
    
    #Een similarity maat tussen titels, en een similarity maat tussen de volledige inhoud van parents en child
    features[['title_similarity', 'content_similarity']] = features.apply(similarity, args=(nlp, ), axis=1)
    
    #De jaccard scores van hierboven worden bij elkaar opgeteld tot een eindscore
    features['jac_total'] = features['sleutelwoorden_jaccard']+\
                     features['BT_TT_jaccard']+\
                     features['title_no_stop_jaccard']+\
                     features['1st_paragraph_no_stop_jaccard']+\
                     features['numbers_jaccard']
    
    # Er wordt variabele gemaakt genaamd date_binary. 
    #Deze variabele geeft weer of het verschil in datum groter dan 2 (0) is of kleinere dan 2 (1)
    features.loc[features['date_diff_days'] < 2, 'date_binary'] = 1
    features.loc[features['date_diff_days'] >= 2, 'date_binary'] = 0
    
    features['match'] = 0
    
    feature_cols = ['child_id',
                    'parent_id',
                    'match',
                    'date_binary',
                    'jac_total',
                    'title_similarity',
                    'content_similarity',
                    'sleutelwoorden_lenmatches',
                    'BT_TT_lenmatches',
                    'title_no_stop_lenmatches',
                    '1st_paragraph_no_stop_lenmatches',
                    'numbers_lenmatches']
    
    to_predict = features[feature_cols]
    to_predict = to_predict.fillna(0)
    
    uiteindelijke_df_geen_match = uiteindelijke_df_geen_match.append(to_predict, ignore_index=True)
    
final_trainset = pd.concat([uiteindelijke_df_geen_match,uiteindelijke_df_match], axis=0, join='inner')
final_trainset = final_trainset.reset_index()
del final_trainset['index']

final_trainset_zm = pd.concat([uiteindelijke_df_geen_match_zm,uiteindelijke_df_match_zm], axis=0, join='inner')
final_trainset_zm = final_trainset_zm.reset_index()
del final_trainset_zm['index']

final_trainset_zm.to_csv(str('~/final_trainset_zm.csv'),
          index = False, 
          float_format='%.4f')

final_trainset.to_csv(str('~/final_trainset.csv'),
          index = False, 
          float_format='%.4f')
