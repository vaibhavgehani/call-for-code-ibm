Containes the machine learning model to predict the active power generated using features of dataset. We have used the Xgboost model to predict the output power generated based on wind speed (Km/h), wind direction (deg) and wind gust (km/h) particularily dependent on date selection.

We have done data preprocessing, feature extraction, model hypertuning <--> model fitting, model validation and check for the data overfiting (Out of box accuracy).

And Used the Flask server to deploy the model integration with pickle to serialize and deserialize the model object.
