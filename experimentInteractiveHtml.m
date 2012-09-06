function [ html ] = experimentInteractiveHtml(experiment,varargin)

global RESULT_ROOT___
rootfolder=RESULT_ROOT___;
outputFolder=fullfile(rootfolder,experiment);
 
disp('Loading Experiment')
[results,paramset]=loadExperiment(experiment,varargin{:});

disp('Creating results.json')
datafile=fullfile(outputFolder,'results.json');
mat2json(datafile,results(:));
disp('Creating paramset.json')
datafile=fullfile(outputFolder,'paramset.json');
mat2json(datafile,multivariateParameters(paramset));

fullpath = mfilename('fullpath');
idx      = find(fullpath == filesep);
viz_folder = fullpath(1:(idx(end)-1));

disp('Copying visualization files')
d3js_folder=fullfile(viz_folder, 'html_d3js');
files={'chartData.js','d3.v2.gf.js','d3LineChart.js','experimentFilter.js','jquery.tipsy.js','tipsy.css','d3LineChart.css','show_data.css','show_data.html'};
for i=1:length(files)
    copyfile(fullfile(d3js_folder, files{i}),fullfile(outputFolder,files{i}))
end

html=fullfile(outputFolder,files{end});
system([html ' &'])
end

