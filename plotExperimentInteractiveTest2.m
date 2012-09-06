function plotExperimentInteractiveTest2

[results,paramset]=loadExperiment('medium_image_runner_results_thwompeceutexasedu_20111202T163026','',[],@postProcessFunc );
outputFolder='C:\cs_experiment\test_visualization';
dependentVars='delta';
metrics={'ssim'};
[resultsA, paramsetA]=filterExperimentData(results, paramset,'reconstruct',{'lasso_tfocs' });
%[resultsA, paramsetA]=filterExperimentData(resultsA, paramsetA,'image',{1 });

plotExperimentInteractive(resultsA,paramsetA,dependentVars,metrics,outputFolder);
% plotExperimentInteractive(results,paramset,dependentVars,metrics,outputFolder);

    





function results=postProcessFunc (results)
if isfield(results,'fine')
    results=rmfield(results,'fine');
end

 