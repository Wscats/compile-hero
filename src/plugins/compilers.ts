/**
 * SASS/SCSS compiler plugin using Dart Sass
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, extname, basename, join } from 'node:path'
import type { CompilerPlugin, CompileResult } from './plugin.js'

export class SassPlugin implements CompilerPlugin {
  readonly id = 'sass'
  readonly name = 'Sass/SCSS'
  readonly extensions = ['sass', 'scss']
  readonly languageIds = ['sass', 'scss']

  canHandle(filePath: string): boolean {
    const ext = extname(filePath).slice(1).toLowerCase()
    return this.extensions.includes(ext)
  }

  async compile(inputPath: string, outputPath: string): Promise<CompileResult> {
    try {
      // Lazy-load sass (Dart Sass) — only loaded when needed
      const sass = await import('sass')
      const result = sass.compile(inputPath, {
        style: 'expanded',
        sourceMap: true,
      })

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, result.css, 'utf-8')

      return { success: true, outputPath }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  }
}

/**
 * LESS compiler plugin
 */
export class LessPlugin implements CompilerPlugin {
  readonly id = 'less'
  readonly name = 'Less'
  readonly extensions = ['less']
  readonly languageIds = ['less']

  canHandle(filePath: string): boolean {
    return extname(filePath).slice(1).toLowerCase() === 'less'
  }

  async compile(inputPath: string, outputPath: string): Promise<CompileResult> {
    try {
      const less = await import('less')
      const { readFile } = await import('node:fs/promises')
      const source = await readFile(inputPath, 'utf-8')

      const result = await less.render(source, {
        filename: inputPath,
        sourceMap: {},
      })

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, result.css, 'utf-8')

      return { success: true, outputPath }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  }
}

/**
 * TypeScript compiler plugin
 */
export class TypeScriptPlugin implements CompilerPlugin {
  readonly id = 'typescript'
  readonly name = 'TypeScript'
  readonly extensions = ['ts', 'tsx']
  readonly languageIds = ['typescript', 'typescriptreact']

  canHandle(filePath: string): boolean {
    const ext = extname(filePath).slice(1).toLowerCase()
    return ['ts', 'tsx'].includes(ext)
  }

  async compile(inputPath: string, outputPath: string): Promise<CompileResult> {
    try {
      const ts = await import('typescript')
      const { readFile } = await import('node:fs/promises')
      const source = await readFile(inputPath, 'utf-8')

      const result = ts.transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          jsx: inputPath.endsWith('.tsx') ? ts.JsxEmit.React : ts.JsxEmit.None,
          sourceMap: true,
        },
        fileName: inputPath,
      })

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, result.outputText, 'utf-8')

      return { success: true, outputPath }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  }
}

/**
 * Pug/Jade compiler plugin
 */
export class PugPlugin implements CompilerPlugin {
  readonly id = 'pug'
  readonly name = 'Pug/Jade'
  readonly extensions = ['pug', 'jade']
  readonly languageIds = ['jade', 'pug']

  canHandle(filePath: string): boolean {
    const ext = extname(filePath).slice(1).toLowerCase()
    return ['pug', 'jade'].includes(ext)
  }

  async compile(inputPath: string, outputPath: string): Promise<CompileResult> {
    try {
      const pug = await import('pug')
      const html = pug.renderFile(inputPath, { pretty: true })

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, html, 'utf-8')

      return { success: true, outputPath }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  }
}
