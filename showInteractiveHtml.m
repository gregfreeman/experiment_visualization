function showInteractiveHtml(experiment,varargin)

global RESULT_ROOT___
rootfolder=RESULT_ROOT___;

outputFolder=fullfile(rootfolder,experiment);
if ~exist(fullfile(outputFolder,'show_data.html'),'file') || ...
   ~exist(fullfile(outputFolder,'results.json'),'file') || ...
   ~exist(fullfile(outputFolder,'paramset.json'),'file') 
    
    html=experimentInteractiveHtml(experiment,varargin{:});
else
    html=fullfile(outputFolder,'show_data.html');
end

if isunix
    system(['firefox ' html ' &'])
else
    system(html)
end

end

