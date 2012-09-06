function plotExperimentInteractive(results,paramset,dependentVars,metrics,outputFolder,plotOptions,textOptions,varargin)
% matrix=compareExperiment(results,paramset,dependentVars,metrics,
%  outputFolder,  plotOptions,textOptions)
%COMPAREEXPERIMENT compares the results of an experiment
% input:
%   results: defines the test results for an experiment
%     n-d array of structures. The dimensions correspond to paramset
%   paramset:  defines all parameters for an experiment
%      an array of structures with fields:
%        name: specifies a parameter name
%        values: cell array of the values for the parameter
%   dependentVars: the variable name that will be plotted on the dependent
%     axis
%   metrics: the names of the fields that will be plotted on the y axes.
%     can be a cell array containing the name of multiple metrics
%     subplots will be created for each metric
%   plotOptions: optional options for the plot commands
%   textOptions: optional options for plot label commands
%  
% output:
%   matrix: a 3d matrix of the values plotted
%      rows: the dependent axis
%      cols: the series in the plot (all parameters not dependent)
%      3rd dimension: each 
% output plots:
%     subplots will be created for each plotted metric
%     all other parameters will be enumerated as plot series and labeled
%     in the legend
%


% data(numel(t))=struct();
% fields={'t','x','y'};
% for iPoint=1:numel(t)
%     for iField=1:numel(fields)
%         data(iPoint).(fields{iField})=eval([fields{iField} '(' num2str(iPoint) ');']);
%     end
% end
% json=savejson('',results);
datafile=fullfile(outputFolder,'results.json');
writejson(datafile,'',results(:));
% fid=fopen(datafile,'w+');
% fprintf(fid,'%s',json);
% fclose(fid);

% json=savejson('',paramset);
datafile=fullfile(outputFolder,'paramset.json');
writejson(datafile,'',multivariateParameters(paramset));
% fid=fopen(datafile,'w+');
% fprintf(fid,'%s',json);
% fclose(fid);


s2=struct('f1','string','f2','string','message','A field named ''fine'' doesn''t exist.','f4',3);

s3=[s2 s2]';

writejson(fullfile(outputFolder,'test2.json'),'',struct('f1','string','f2','string','f3',s3,'f4',3))

s4={s2 s2};

writejson(fullfile(outputFolder,'test3.json'),'',struct('f1','string','f2','string','f3',s4,'f4',3))
