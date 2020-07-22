#importing the library

import datetime
import time
import pandas as pd
import numpy as np
import xgboost as xgb
import pickle


#Reading the dataset

data=pd.read_csv('T1.csv')


#preprocessing of the dataset and feature enginering

data.rename(columns={'Theoretical_Power_Curve (KWh)':'Power','LV ActivePower (kW)':'ActivePower',"Wind Speed (m/s)":"WindSpeed","Wind Direction (°)":"WindDirection"},inplace=True)
data['Time']=data['Date/Time'].apply(lambda x: time.strptime(x,"%d %m %Y %H:%M")[4])
temp=data['Time'][1:].values - data['Time'][0:-1].values
temp=np.array([0]+list(temp))
data['TimeDiff']=temp
data['Gust']=np.array([0]+list(data['WindSpeed'][1:].values-data['WindSpeed'][:-1].values))
data_=data[data['TimeDiff'].isin([10,-50])]
data_=data_[data_['ActivePower']>=0]
x_train=data_[['WindSpeed','WindDirection','Gust']].values
y_train=data_['ActivePower'].values


#Model training (Parameter used are trained using the lasso regression)

model_xgb1 = xgb.XGBRegressor(learning_rate=2e-2, max_depth=4, min_child_weight=1.1, n_estimators=100, reg_alpha=0.3, reg_lambda=0.7, nthread = -1)
model_xgb1.fit(x_train,y_train)


#Dumping Model into pkl byte code (serializing the model object)

pickle.dump(model_xgb1,open('xgbModel.pkl','wb'))