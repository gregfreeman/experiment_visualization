% function experimentGenerateJsonTest

metrics={'ms_ssim','ssim','mse','runtime'};
outputResultFolder='C:\cs_experiment\show_images\results';
inputResultFolder=outputResultFolder;

[results,parmset]=loadExperiment(experimentName,inputResultFolder );
for i=1:numel(results)
    results(i).settings.output_folder='medium_image_runner_results_thwompeceutexasedu_20111202T163026';
    results(i).settings.case_number=i;
end

experimentName='runner_gsm_lasso_test_results_thwompeceutexasedu_20120221T194729';
experimentGenerateJson(experimentName,inputResultFolder,outputResultFolder,metrics)
% function results=postProcessFunc (results)

