import type { Denops } from "https://deno.land/x/denops_std@v6.4.0/mod.ts";
import * as u from "jsr:@core/unknownutil@3.18.0";
import { $ } from "jsr:@david/dax@0.41.0";
import { TryAsync } from "jsr:@qnighy/metaflow@0.1.0/exception";

/** Check if the object is a snippet config */
const isSnippetConfig = u.isObjectOf({
  language: u.isUnionOf([u.isString, u.isArrayOf(u.isString)]),
  path: u.isString,
});

/** Check if the object is a package.json with snippet */
const isPackageJsonWithSnippet = u.isObjectOf({
  contributes: u.isObjectOf({
    snippets: u.isArrayOf(isSnippetConfig),
  }),
});
type PackageJsonWithSnippet = u.PredicateType<typeof isPackageJsonWithSnippet>;

/** Get package.json path */
function getPackageJsonPath(runtimePath: string) {
  return $.path(runtimePath).join("package.json");
}

/** Load denippet snippet */
async function loadDenippetSnippet(
  denops: Denops,
  path: string,
  language: string | string[],
) {
  await denops.dispatch("denippet", "load", path, language);
}

/** get runtime path */
async function getRuntimePath(
  denops: Denops,
) {
  const runtimePath = await denops.eval("&runtimepath");
  u.assert(runtimePath, u.isString);
  return runtimePath.split(",");
}

async function isDebug(denops: Denops) {
  const debug = await denops.eval("get(g:, 'denops#debug', 0)");

  return debug === 1;
}

/** Get snippet array */
async function getSnippetArray(runtimePath: string[]) {
  const snippetRuntimePathArray = runtimePath.filter(
    (path) => getPackageJsonPath(path).exists(),
  );

  const snippetPathArrayWithPackageJson = await Promise.all(
    snippetRuntimePathArray.map(
      async (path) => {
        const packageJsonPath = getPackageJsonPath(path);

        const packageJsonObj =
          (await TryAsync(async () => await packageJsonPath.readJson()))
            .done(() => {});

        return { path, packageJsonObj };
      },
    ),
  );

  const snippetPathWithLanguage = snippetPathArrayWithPackageJson
    .filter(({ packageJsonObj }) => isPackageJsonWithSnippet(packageJsonObj))
    .flatMap(({ path, packageJsonObj }) => {
      const { contributes: { snippets } } =
        packageJsonObj as PackageJsonWithSnippet;

      return snippets.map(({ language, path: snippetPath }) => (
        {
          language,
          snippetPath: $.path(path).join(snippetPath).toString(),
        }
      ));
    });

  return snippetPathWithLanguage;
}

export function main(denops: Denops) {
  denops.dispatcher = {
    async load(): Promise<void> {
      const runtimePath = await getRuntimePath(denops);
      const snippetPaths = await getSnippetArray(runtimePath);

      isDebug(denops).then((id) => {
        if (id) {
          snippetPaths.forEach(({ language, snippetPath }) =>
            console.log({ language, snippetPath })
          );
        }
      });

      await Promise.all(
        snippetPaths.map(({ language, snippetPath }) =>
          loadDenippetSnippet(denops, snippetPath, language)
        ),
      );
    },
  };
}
