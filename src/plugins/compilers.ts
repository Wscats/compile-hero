/**
 * SASS/SCSS compiler plugin using Dart Sass
 */

import { writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, extname } from "node:path";
import type { CompilerPlugin, CompileInput, CompileOutput } from "./plugin.js";

// ─── Shared compile cache (mtime-based) ──────────────────────────────────────
// Key: inputPath, Value: { mtime, outputPath }
const compileCache = new Map<string, { mtime: number; outputPath: string }>();

async function isCacheValid(inputPath: string, outputPath: string): Promise<boolean> {
  const cached = compileCache.get(inputPath);
  if (!cached || cached.outputPath !== outputPath) return false;
  try {
    const [inputStat, outputStat] = await Promise.all([
      stat(inputPath),
      stat(outputPath),
    ]);
    return inputStat.mtimeMs <= cached.mtime && outputStat.mtimeMs > 0;
  } catch {
    return false;
  }
}

function updateCache(inputPath: string, outputPath: string, mtime: number): void {
  compileCache.set(inputPath, { mtime, outputPath });
}

export class SassPlugin implements CompilerPlugin {
  readonly id = "sass";
  readonly name = "Sass/SCSS";
  readonly supportedExtensions = ["sass", "scss"] as const;
  readonly languageIds = ["sass", "scss"] as const;

  canHandle(filePath: string): boolean {
    const ext = extname(filePath).slice(1).toLowerCase();
    return (this.supportedExtensions as readonly string[]).includes(ext);
  }

  async compile(input: CompileInput): Promise<CompileOutput> {
    const { inputPath, outputPath } = input;
    try {
      // Check mtime cache — skip recompile if source unchanged
      const inputStat = await stat(inputPath);
      if (await isCacheValid(inputPath, outputPath)) {
        return { success: true, outputPath };
      }

      // Lazy-load sass (Dart Sass) — only loaded when needed
      const sass = await import("sass");
      const result = sass.compile(inputPath, {
        style: "expanded",
        sourceMap: true,
      });

      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, result.css, "utf-8");
      updateCache(inputPath, outputPath, inputStat.mtimeMs);

      return { success: true, outputPath };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }

  dispose(): void {
    // Remove cache entries for this plugin's extensions
    for (const [key] of compileCache) {
      if (this.canHandle(key)) compileCache.delete(key);
    }
  }
}

/**
 * LESS compiler plugin
 */
export class LessPlugin implements CompilerPlugin {
  readonly id = "less";
  readonly name = "Less";
  readonly supportedExtensions = ["less"] as const;
  readonly languageIds = ["less"] as const;

  canHandle(filePath: string): boolean {
    return extname(filePath).slice(1).toLowerCase() === "less";
  }

  async compile(input: CompileInput): Promise<CompileOutput> {
    const { inputPath, outputPath } = input;
    try {
      const inputStat = await stat(inputPath);
      if (await isCacheValid(inputPath, outputPath)) {
        return { success: true, outputPath };
      }

      const less = await import("less");
      const { readFile } = await import("node:fs/promises");
      const source = await readFile(inputPath, "utf-8");

      const result = await less.render(source, {
        filename: inputPath,
        sourceMap: {},
      });

      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, result.css, "utf-8");
      updateCache(inputPath, outputPath, inputStat.mtimeMs);

      return { success: true, outputPath };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }

  dispose(): void {
    for (const [key] of compileCache) {
      if (this.canHandle(key)) compileCache.delete(key);
    }
  }
}

/**
 * TypeScript compiler plugin
 */
export class TypeScriptPlugin implements CompilerPlugin {
  readonly id = "typescript";
  readonly name = "TypeScript";
  readonly supportedExtensions = ["ts", "tsx"] as const;
  readonly languageIds = ["typescript", "typescriptreact"] as const;

  canHandle(filePath: string): boolean {
    const ext = extname(filePath).slice(1).toLowerCase();
    return (this.supportedExtensions as readonly string[]).includes(ext);
  }

  async compile(input: CompileInput): Promise<CompileOutput> {
    const { inputPath, outputPath } = input;
    try {
      const inputStat = await stat(inputPath);
      if (await isCacheValid(inputPath, outputPath)) {
        return { success: true, outputPath };
      }

      const ts = await import("typescript");
      const { readFile } = await import("node:fs/promises");
      const source = await readFile(inputPath, "utf-8");

      const result = ts.transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.CommonJS,
          jsx: inputPath.endsWith(".tsx") ? ts.JsxEmit.React : ts.JsxEmit.None,
          sourceMap: true,
        },
        fileName: inputPath,
      });

      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, result.outputText, "utf-8");
      updateCache(inputPath, outputPath, inputStat.mtimeMs);

      return { success: true, outputPath };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }

  dispose(): void {
    for (const [key] of compileCache) {
      if (this.canHandle(key)) compileCache.delete(key);
    }
  }
}

/**
 * Pug/Jade compiler plugin
 */
export class PugPlugin implements CompilerPlugin {
  readonly id = "pug";
  readonly name = "Pug/Jade";
  readonly supportedExtensions = ["pug", "jade"] as const;
  readonly languageIds = ["jade", "pug"] as const;

  canHandle(filePath: string): boolean {
    const ext = extname(filePath).slice(1).toLowerCase();
    return (this.supportedExtensions as readonly string[]).includes(ext);
  }

  async compile(input: CompileInput): Promise<CompileOutput> {
    const { inputPath, outputPath } = input;
    try {
      const inputStat = await stat(inputPath);
      if (await isCacheValid(inputPath, outputPath)) {
        return { success: true, outputPath };
      }

      const pug = await import("pug");
      const html = pug.renderFile(inputPath, { pretty: true });

      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, "utf-8");
      updateCache(inputPath, outputPath, inputStat.mtimeMs);

      return { success: true, outputPath };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }

  dispose(): void {
    for (const [key] of compileCache) {
      if (this.canHandle(key)) compileCache.delete(key);
    }
  }
}
