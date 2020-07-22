package com.example.currentlocation;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;

public class WeatherInfoActivity extends AppCompatActivity {

    private String windSpeed,windDir,WindGustKmph;
    TextView t2,t4,t6,t8;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_weather_info);

        Intent intent = getIntent();
        double lat = intent.getDoubleExtra("Latitude", 0);
        double lng = intent.getDoubleExtra("Longitude", 0);
        String date = intent.getStringExtra("date");

        String l1 = String.valueOf(lat);
        String l2 = String.valueOf(lng);

        t2 = findViewById(R.id.textView2);
        t4 = findViewById(R.id.textView4);
        t6 = findViewById(R.id.textView6);
        t8 = findViewById(R.id.textView8);

        downloadtask task = new downloadtask();

        task.execute("https://api.worldweatheronline.com/premium/v1/weather.ashx?" +
                "key=f04779a17453462e857130251200607&q="+l1+","+l2 +
                "&date="+date+"&format=json");


    }


    public class downloadtask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            String result = "";
            URL url;
            HttpURLConnection urlConnection = null;
            try {
                url = new URL(urls[0]);
                urlConnection = (HttpURLConnection) url.openConnection();
                InputStream in = urlConnection.getInputStream();
                InputStreamReader reader = new InputStreamReader(in);
                int data = reader.read();

                while (data != -1) {
                    char current = (char) data;
                    result += current;
                    data = reader.read();
                }
                Log.i("result",result);
                return result;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            try {
                Log.i("JSONData", s);
                String main = "", result = "";
                String description = "";
                JSONObject jsonObject = new JSONObject(s);

                //Log.i("Speed",s)
                String data = jsonObject.getString("data");
                Log.i("Info", data);

                JSONObject jsonObject1 = new JSONObject(data);
                String current = jsonObject1.getString("current_condition");
                Log.i("current",current);

                JSONArray jsonArray = new JSONArray(current);
                JSONObject jsonpart = jsonArray.getJSONObject(0);
                String speed = jsonpart.getString("windspeedKmph");
                String dir = jsonpart.getString("winddirDegree");
                Log.i("speed",speed);
                Log.i("dir",dir);


                JSONObject jsonObject2 = new JSONObject(data);
                String weather = jsonObject2.getString("weather");
                Log.i("weather",weather);


                JSONArray jsonArray3 = new JSONArray(weather);
                JSONObject jsonpart1 = jsonArray3.getJSONObject(0);
                String hourly = jsonpart1.getString("hourly");
                Log.i("hourly",hourly);


                JSONArray jsonArray4 = new JSONArray(hourly);
                JSONObject jsonpart2 = jsonArray4.getJSONObject(0);
                String windGustKmph = jsonpart2.getString("WindGustKmph");
                Log.i("WindGustKmph",windGustKmph);

                windSpeed = speed;
                windDir = dir;
                WindGustKmph = windGustKmph;
                Log.i("ds","After gust");

                Log.i("ds","Before sending");

                t2.setText(windSpeed);
                t4.setText(windDir);
                t6.setText(WindGustKmph);

                SendData data1 = new SendData();
                data1.execute("https://windz-flask-server.herokuapp.com/predict?windSpeed="+windSpeed+"&windDirection="+windDir+"&windGust="+WindGustKmph);
                return;

            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(getApplicationContext(), "Could not find weather",
                        Toast.LENGTH_SHORT).show();
            }
        }
    }

    public class SendData extends AsyncTask<String, Void, String> {

        @Override
        protected String doInBackground(String... strings) {
            String result = "";
            URL url;
            HttpURLConnection urlConnection = null;
            try {
                url = new URL(strings[0]);
                urlConnection = (HttpURLConnection) url.openConnection();
                InputStream in = urlConnection.getInputStream();
                InputStreamReader reader = new InputStreamReader(in);
                int data = reader.read();

                while (data != -1) {
                    char current = (char) data;
                    result += current;
                    data = reader.read();
                }
                Log.i("resultgcgj",result);
                return result;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }


        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            String s1 = null;
            try {
            JSONObject jsonObject = new JSONObject(s);
            s1 = jsonObject.getString("output");
            } catch (Exception e) {
                e.printStackTrace();
            }
            float x = Float.valueOf(s1);
            int y = (int) x;
            s1 = String.valueOf(y);
            Log.i("Info", s1);
            t8.setText(s1);
        }
    }
}
