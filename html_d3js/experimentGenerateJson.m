function experimentGenerateHtml(experimentName,inputResultFolder,outputResultFolder,metrics)
%TESTRUNNERCOLLECT collects results of each test case and stores them in an
%    n-d array of structures for each test result
%  input:
%    foldername specifies the folder from which the test results are collected
%  output:
%    resultsCollection an n-d array of structures for each test result
%       the dimensions of the array correspond to the paramset definition.
%       each item has a field named 'settings' which include the settings
%       under which the test was run
%


% load(fullfile(inputResultFolder,experimentName,'paramset'),'paramset')
load(fullfile(inputResultFolder,experimentName,'results'),'results');
numCases=numel(results);

global EXPERIMENT_FRAMEWORK_ROOT___
t=zeros(numCases,1);
for iCase=1:numCases
    try
%         load(fullfile(inputResultFolder,experimentName,sprintf('results_%04d',iCase)),'results');
        obj.settings=results(iCase).settings;
        [path,name]=fileparts(results(iCase).settings.output_folder);
        obj.settings.experimentName=name;

        for iMetric=1:length(metrics)
            obj.results.(metrics{iMetric})=results(iCase).(metrics{iMetric});
        end
        json=savejson('',obj);
%         json_escape=strrep(json, '"', '\"');
        outFile=fullfile(outputResultFolder,experimentName,sprintf('results_%04d.html',iCase));
        converter=fullfile(EXPERIMENT_FRAMEWORK_ROOT___,'html','output_html.rb');
        tempfile=fullfile(EXPERIMENT_FRAMEWORK_ROOT___,'temp.json');
%         [status,converter_cygpath]=system(sprintf('cygpath "%s"',converter));
%         [status,outFile_cygpath]=system(sprintf('cygpath "%s"',outFile));
%         [status,tempFile_cygpath]=system(sprintf('cygpath "%s"',tempfile));
        fid=fopen(tempfile,'w+');
        fprintf(fid,'%s',json);
        fclose(fid);
%         cmd=sprintf('bash -c "echo ''%s'' | %s  > %s',json_escape,converter_cygpath,outFile_cygpath);
%         cmd=sprintf('bash -c "echo ''%s'' > %s"',json_escape,tempFile_cygpath);
%         cmd=sprintf('bash -c "cat %s | %s > %s"',strtrim(tempFile_cygpath),strtrim(converter_cygpath),strtrim(outFile_cygpath));
        cmd=sprintf('cat %s | ruby %s > %s"',strtrim(tempfile),strtrim(converter),strtrim(outFile));
        tic
        system(cmd);
        t(iCase)=toc;
        disp(iCase)
    
    catch exception
        results.error=exception;
        results.errorReport=getReport(exception,'extended');
        disp (sprintf('*********** Error: case %d',iCase))
        disp (results.errorReport)
    end
end
mean(t)
