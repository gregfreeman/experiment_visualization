function plotExperimentInteractiveTest

param1.field='t';
param1.values=num2cell(0.05:0.15:0.5);

param2.field='multiplier';
param2.values={1,2};

param3.field='bogus';
param3.values={'bogus1','bogus2'};

paramset=[param1,param2,param3];

events=struct();
events.runExperiment=@getExperiment;
events.loadInputData=@getData;

% testRunner(paramset,events);
[results,paramset]=loadExperiment('plotExperimentInteractiveTest_results_pcgfreeman_20120514T203717');
outputFolder='C:\cs_experiment\test_visualization';
dependentVars='t';
metrics={'val'};
plotExperimentInteractive(results,paramset,dependentVars,metrics,outputFolder);
end

function [inputData,settings]=getData(settings)
inputData.val=rand(1);
end

function [outputData,results]=getExperiment(inputData,settings) 

results.val=inputData.val*settings.multiplier*settings.t;
outputData=[];
end
    

