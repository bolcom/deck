'use strict';

describe('azureServerGroupTransformer', function () {

  var transformer;

  beforeEach(
    window.module(
      require('./serverGroup.transformer.js').name
    )
  );

  beforeEach(function () {
    window.inject(function (_azureServerGroupTransformer_) {
      transformer = _azureServerGroupTransformer_;
    });
  });

  describe('command transforms', function () {

    it('sets name correctly with no stack or detail', function () {
      var base = {
        application: 'myApp',
        sku:{
          capacity: 1,
        },
        selectedImage:{
          publisher: 'Microsoft',
          offer: 'Windows',
          sku: 'Server2016',
          version: '12.0.0.1',
        },
        viewState: {
          mode: 'create',
        },
      };

      var transformed = transformer.convertServerGroupCommandToDeployConfiguration(base);

      expect(transformed.name).toBe('myApp');

    });

    it('it sets name correctly with only stack', function () {
      var command = {
        stack: 's1',
        application: 'theApp',
        sku:{
          capacity: 1,
        },
        selectedImage:{
          publisher: 'Microsoft',
          offer: 'Windows',
          sku: 'Server2016',
          version: '12.0.0.1',
        },
        viewState: {
          mode: 'create',
        }
      };

      var transformed = transformer.convertServerGroupCommandToDeployConfiguration(command);

      expect(transformed.name).toBe('theApp-s1');
    });

    it('it sets name correctly with only detail', function () {
      var command = {
        freeFormDetails: 'd1',
        application: 'theApp',
        sku:{
          capacity: 1,
        },
        selectedImage:{
          publisher: 'Microsoft',
          offer: 'Windows',
          sku: 'Server2016',
          version: '12.0.0.1',
        },
        viewState: {
          mode: 'create',
        }
      };

      var transformed = transformer.convertServerGroupCommandToDeployConfiguration(command);

      expect(transformed.name).toBe('theApp-d1');
    });

    it('it sets name correctly with both stack and detail', function () {
      var command = {
        stack: 's1',
        freeFormDetails: 'd1',
        application: 'theApp',
        sku:{
          capacity: 1,
        },
        selectedImage:{
          publisher: 'Microsoft',
          offer: 'Windows',
          sku: 'Server2016',
          version: '12.0.0.1',
        },
        viewState: {
          mode: 'create',
        }
      };

      var transformed = transformer.convertServerGroupCommandToDeployConfiguration(command);

      expect(transformed.name).toBe('theApp-s1-d1');
    });

    it('it sets the Advanced Settings correctly when provided', function() {
      var command = {
        stack: 's1',
        freeFormDetails: 'd1',
        application: 'theApp',
        sku:{
          capacity: 1,
        },
        selectedImage:{
          publisher: 'Microsoft',
          offer: 'Windows',
          sku: 'Server2016',
          version: '12.0.0.1',
        },
        viewState: {
          mode: 'create',
        },
        osConfig: {
          customData: 'this is custom data',
        },
        customScriptsSettings:{
          fileUris: 'file1',
          commandToExecute: 'do_this',
        }
      };

      var customScript = {
        fileUris: ['file1'],
        commandToExecute: 'do_this',
      };

      var transformed = transformer.convertServerGroupCommandToDeployConfiguration(command);
      expect(transformed.osConfig.customData).toBe('this is custom data');
      expect(transformed.customScriptsSettings).toEqual(customScript);
    });

    it('it sets the Advanced Settings correctly when not provided', function() {
      var command = {
        stack: 's1',
        freeFormDetails: 'd1',
        application: 'theApp',
        sku:{
          capacity: 1,
        },
        selectedImage:{
          publisher: 'Microsoft',
          offer: 'Windows',
          sku: 'Server2016',
          version: '12.0.0.1',
        },
        viewState: {
          mode: 'create',
        }
      };

      var transformed = transformer.convertServerGroupCommandToDeployConfiguration(command);

      expect(transformed.customScriptsSettings).toBeDefined();
      expect(transformed.customScriptsSettings.fileUris).toBeNull();
      expect(transformed.customScriptsSettings.commandToExecute).toBe('');
    });

  });
});
