close all
t=-pi:pi/2:pi;
x=sin(t);
y=cos(t);

% h=plot(t,[x;y],'gs-');

data(numel(t))=struct();
fields={'t','x','y'};
for iPoint=1:numel(t)
    for iField=1:numel(fields)
        data(iPoint).(fields{iField})=eval([fields{iField} '(' num2str(iPoint) ');']);
    end
end
json=savejson('',data);
outputResultFolder='C:\cs_experiment\test_visualization';

tempfile=fullfile(outputResultFolder,'sin_test_data.json');
fid=fopen(tempfile,'w+');
fprintf(fid,'%s',json);
fclose(fid);
        




