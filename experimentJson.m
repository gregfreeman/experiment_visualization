function experimentJson(experiment,rootfolder,varargin)

global RESULT_ROOT___

if ~exist('rootfolder','var') || isempty(rootfolder)
    rootfolder=RESULT_ROOT___;
end

outputFolder=fullfile(rootfolder,experiment);
 
disp('Loading Experiment')
[results,paramset]=loadExperiment(experiment,rootfolder,varargin{:});

disp('Creating results.json')
datafile=fullfile(outputFolder,'results.json');
mat2json(datafile,results(:));
disp('Creating paramset.json')
datafile=fullfile(outputFolder,'paramset.json');
mat2json(datafile,multivariateParameters(paramset));


end

