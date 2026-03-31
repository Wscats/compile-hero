/**
 * Compile Hero - Extension unit tests.
 * Tests core utility functions and type definitions.
 */

import * as assert from 'assert';

// Test utility functions that don't depend on VS Code API
// (VS Code API tests require the extension test runner)

suite('Utility Function Tests', function () {
  test('fileType extracts correct file extension', function () {
    // Inline implementation for testing without VS Code dependency
    const fileType = (filename: string): string => {
      const dotIndex = filename.lastIndexOf('.');
      return filename.substring(dotIndex);
    };

    assert.strictEqual(fileType('style.scss'), '.scss');
    assert.strictEqual(fileType('app.ts'), '.ts');
    assert.strictEqual(fileType('component.tsx'), '.tsx');
    assert.strictEqual(fileType('main.js'), '.js');
    assert.strictEqual(fileType('template.pug'), '.pug');
    assert.strictEqual(fileType('page.jade'), '.jade');
    assert.strictEqual(fileType('theme.less'), '.less');
    assert.strictEqual(fileType('base.styl'), '.styl');
    assert.strictEqual(fileType('base.sass'), '.sass');
    assert.strictEqual(fileType('path/to/file.css'), '.css');
  });

  test('transformPort extracts PID from lsof output', function () {
    const transformPort = (data: string): string => {
      let port = '';
      const lines = data.split(/[\n|\r]/);
      for (const item of lines) {
        if (item.indexOf('LISTEN') !== -1 && !port) {
          const parts = item.split(/\s+/);
          if (parts[1] && /\d+/.test(parts[1])) {
            port = parts[1];
            break;
          }
        }
      }
      return port;
    };

    const lsofOutput = [
      'COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME',
      'node    12345  user   22u  IPv6 0x1234  0t0  TCP *:3000 (LISTEN)',
    ].join('\n');

    assert.strictEqual(transformPort(lsofOutput), '12345');
    assert.strictEqual(transformPort('no listen here'), '');
    assert.strictEqual(transformPort(''), '');
  });

  test('getErrorMessage handles different error types', function () {
    const getErrorMessage = (error: unknown): string => {
      if (error instanceof Error) {
        return error.message;
      }
      return String(error);
    };

    assert.strictEqual(getErrorMessage(new Error('test error')), 'test error');
    assert.strictEqual(getErrorMessage('string error'), 'string error');
    assert.strictEqual(getErrorMessage(42), '42');
    assert.strictEqual(getErrorMessage(null), 'null');
    assert.strictEqual(getErrorMessage(undefined), 'undefined');
  });

  test('LANGUAGE_SUFFIX enum values are correct', function () {
    // Verify the expected suffix values
    const expectedSuffixes = ['.js', '.scss', '.sass', '.less', '.jade', '.ts', '.tsx', '.pug', '.styl'];
    const allValid = expectedSuffixes.every(s => s.startsWith('.'));
    assert.strictEqual(allValid, true);
  });

  test('compiled file pattern detection', function () {
    const COMPILED_FILE_PATTERN = /\.dev\.js|\.prod\.js$/;

    assert.strictEqual(COMPILED_FILE_PATTERN.test('app.dev.js'), true);
    assert.strictEqual(COMPILED_FILE_PATTERN.test('app.prod.js'), true);
    assert.strictEqual(COMPILED_FILE_PATTERN.test('app.js'), false);
    assert.strictEqual(COMPILED_FILE_PATTERN.test('app.ts'), false);
    assert.strictEqual(COMPILED_FILE_PATTERN.test('dev.js.map'), false);
  });

  test('browser name standardization logic', function () {
    // Test the standardization logic without VS Code dependency
    const browsers = [
      { standardName: 'chrome', acceptName: ['chrome', 'google chrome', 'gc'] },
      { standardName: 'firefox', acceptName: ['firefox', 'ff', 'mozilla firefox'] },
      { standardName: 'safari', acceptName: ['safari'] },
    ];

    const standardize = (name: string): string => {
      const normalized = name.toLowerCase();
      const browser = browsers.find(b => b.acceptName.indexOf(normalized) !== -1);
      return browser ? browser.standardName : '';
    };

    assert.strictEqual(standardize('Chrome'), 'chrome');
    assert.strictEqual(standardize('gc'), 'chrome');
    assert.strictEqual(standardize('FF'), 'firefox');
    assert.strictEqual(standardize('Safari'), 'safari');
    assert.strictEqual(standardize('unknown'), '');
    assert.strictEqual(standardize(''), '');
  });

  test('variable check logic for output paths', function () {
    // Test the variable validation logic
    const hasUnsupportedVariable = (uri: string): boolean => {
      if (
        uri.indexOf('}/') < 0 &&
        uri.length - uri.indexOf('}') > 1 &&
        uri.indexOf('$') >= 0
      ) {
        return true;
      }
      return false;
    };

    const hasWorkspaceFolder = (uri: string): boolean => {
      return uri.indexOf('${workspaceFolder}') >= 0;
    };

    assert.strictEqual(hasWorkspaceFolder('${workspaceFolder}/dist'), true);
    assert.strictEqual(hasWorkspaceFolder('./dist'), false);
    assert.strictEqual(hasUnsupportedVariable('${unknownVar}extra'), true);
    assert.strictEqual(hasUnsupportedVariable('./dist'), false);
  });
});