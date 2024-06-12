import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Plot from 'react-plotly.js';
import './HistoryResults.css';
const regression = require('ml-regression');
const movingAverages = require('moving-averages');

function HistoryResults(props) {
  const [documentData, setDocumentData] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const history = useHistory();
  const selectedDocument = props.location.state.selectedDocument;
  const formData = props.location.state.formData;

  useEffect(() => {
    if (selectedDocument) {
      setDocumentData(selectedDocument); // Set document data
      setPatientInfo({
        name: formData.name,
        surname: formData.surname,
        date_of_test: selectedDocument.date_of_test
      }); // Set patient info
    }
  }, [selectedDocument]);

  useEffect(() => {
    if (documentData && documentData.fatigue_B_values) {
      // Calculate polynomial fit
      const polyFitModel = new regression.PolynomialRegression(
        Array.from({ length: documentData.fatigue_B_values.length }, (_, i) => [i]), // X values (indices)
        documentData.fatigue_B_values, // Y values
        3 // Degree of the polynomial fit
      );
      const polyFitValues = Array.from({ length: documentData.fatigue_B_values.length }, (_, i) => polyFitModel.predict(i));
  
      // Calculate moving mean
      const windowSize = 4;
      const movingMeanValues = movingAverages.ma(documentData.fatigue_B_values, windowSize);
  
      // Update documentData with calculated values
      setDocumentData(prevData => ({
        ...prevData,
        polyFitValues: polyFitValues,
        movingMeanValues: movingMeanValues
      }));
    }
  }, [documentData?.fatigue_B_values]);

  useEffect(() => {
    if (documentData && documentData.mnf_values && documentData.mpf_values) {
      // Calculate linear regression for mnf_values
      const mnfModel = new regression.SimpleLinearRegression(
        Array.from({ length: documentData.mnf_values.length }, (_, i) => i),
        documentData.mnf_values
      );
      const mnfRegressionValues = Array.from({ length: documentData.mnf_values.length }, (_, i) => mnfModel.predict(i));

      // Calculate linear regression for mpf_values
      const mpfModel = new regression.SimpleLinearRegression(
        Array.from({ length: documentData.mpf_values.length }, (_, i) => i),
        documentData.mpf_values
      );
      const mpfRegressionValues = Array.from({ length: documentData.mpf_values.length }, (_, i) => mpfModel.predict(i));

      // Update documentData with calculated regression values
      setDocumentData(prevData => ({
        ...prevData,
        mnfRegressionValues: mnfRegressionValues,
        mpfRegressionValues: mpfRegressionValues
      }));
    }
  }, [documentData?.mnf_values, documentData?.mpf_values]);

  return (
    <div className="history-results-container">
      <div className="history-results-box">
        <h2 className="history-results-title">History Results</h2>
        {patientInfo && (
          <div className="patient-details-list">
            <div className="patient-info-row">
              <div className="info-item">
                <p className="info-label">Name: <span className="info-value">{formData.name}</span></p>
                <p className="info-label">Surname: <span className="info-value">{formData.surname}</span></p>
                <p className="info-label">Date of Test: <span className="info-value">{patientInfo.date_of_test}</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="plot-wrapper">
        {/* First Plot: mnf_values and mpf_values with Linear Regression */}
        {documentData && (
          <Plot
            data={[
              // Plot data for mnf_values
              {
                x: Array.from({ length: documentData.mnf_values.length }, (_, i) => i * 0.5),
                y: documentData.mnf_values,
                type: 'scatter',
                mode: 'lines',
                name: 'MNF Values',
              },
              // Plot data for mnf linear regression
              {
                x: Array.from({ length: documentData.mnfRegressionValues ? documentData.mnfRegressionValues.length : 0 }, (_, i) => i * 0.5),
                y: documentData.mnfRegressionValues,
                type: 'scatter',
                mode: 'lines',
                name: 'MNF Linear Regression',
                line: { color: 'blue', dash: 'dash' },
              },
              // Plot data for mpf_values
              {
                x: Array.from({ length: documentData.mpf_values.length }, (_, i) => i * 0.5),
                y: documentData.mpf_values,
                type: 'scatter',
                mode: 'lines',
                name: 'MPF Values',
              },
              // Plot data for mpf linear regression
              {
                x: Array.from({ length: documentData.mpfRegressionValues ? documentData.mpfRegressionValues.length : 0 }, (_, i) => i * 0.5),
                y: documentData.mpfRegressionValues,
                type: 'scatter',
                mode: 'lines',
                name: 'MPF Linear Regression',
                line: { color: 'orange', dash: 'dash' },
              },
            ]}
            layout={{
              xaxis: { title: 'Time (seconds)', automargin: true },
              yaxis: { title: 'Frequency(Hz)', automargin: true },
              autosize: true, // Enable autosizing to fill the container
              showlegend: true, // Show legend inside the plot
              legend: { x: 1, y: 1, xanchor: 'right', yanchor: 'top' }, // Position legend inside the plot (top-left)
              margin: { t: 10, l: 10, r: 10, b: 10 }, // Adjust margin to minimize white space
              paper_bgcolor: '#f0f0f0', // Set background color
              plot_bgcolor: '#ffffff', // Set plot area color
              bordercolor: '#000000', // Set border color
              borderwidth: 1, // Set border width
            }}
            style={{ width: '100%', height: '30vh', marginBottom: '10px' }} // Set plot height to occupy 30% of viewport height
          />
        )}

        {/* Second Plot: Fatigue A Values */}
        {documentData && (
          <Plot
            data={[
              // Plot data for fatigue_A_values
              {
                x: Array.from({ length: documentData.fatigue_A_values.length }, (_, i) => i * 1.5),
                y: documentData.fatigue_A_values,
                type: 'scatter',
                mode: 'lines',
                name: 'Fatigue A Values',
              },
            ]}
            layout={{
              xaxis: { title: 'Time (seconds)', automargin: true },
              yaxis: { title: 'Fatigue Level', automargin: true },
              autosize: true, // Enable autosizing to fill the container
              showlegend: true, // Show legend inside the plot
              legend: { x: 0.02, y: 0.98 }, // Position legend inside the plot (top-left)
              margin: { t: 10, l: 10, r: 10, b: 10 }, // Adjust margin to minimize white space
              paper_bgcolor: '#f0f0f0', // Set background color
              plot_bgcolor: '#ffffff', // Set plot area color
              bordercolor: '#000000', // Set border color
              borderwidth: 1, // Set border width
            }}
            style={{ width: '100%', height: '30vh', marginBottom: '10px' }} // Set plot height to occupy 30% of viewport height
          />
        )}
        
        {/* Third Plot: Fatigue B Values with Moving Average and Polynomial Fit */}
        {documentData && (
          <Plot
            data={[
              // Plot data for fatigue_B_values
              {
                x: Array.from({ length: documentData.fatigue_B_values.length }, (_, i) => i * 0.5),
                y: documentData.fatigue_B_values,
                type: 'scatter',
                mode: 'lines',
                name: 'Fatigue B Values',
              },
              // Plot data for polynomial fit
              {
                x: Array.from({ length: documentData.polyFitValues ? documentData.polyFitValues.length : 0 }, (_, i) => i * 0.5),
                y: documentData.polyFitValues,
                type: 'scatter',
                mode: 'lines',
                name: 'Polynomial Fit',
                line: { color: 'green'},
              },
              // Plot data for moving average
              {
                x: Array.from({ length: documentData.movingMeanValues ? documentData.movingMeanValues.length : 0 }, (_, i) => i * 0.5),
                y: documentData.movingMeanValues,
                type: 'scatter',
                mode: 'lines',
                name: 'Moving Average',
                line: { color: 'red', dash: 'dash' },
              },
            ]}
            layout={{
              xaxis: { title: 'Time (seconds)', automargin: true },
              yaxis: { title: 'Fatigue value', automargin: true },
              autosize: true,
              showlegend: true,
              legend: { x: 0.02, y: 0.98 },
              margin: { t: 10, l: 10, r: 10, b: 10 },
              paper_bgcolor: '#f0f0f0',
              plot_bgcolor: '#ffffff',
              bordercolor: '#000000',
              borderwidth: 1,
            }}
            style={{ width: '100%', height: '30vh', marginBottom: '10px' }} // Set plot height to occupy 30% of viewport height
          />
        )}
      </div>
      <button onClick={() => history.push('/access-history')}>Go Back</button>
    </div>
  );
}

export default HistoryResults;
