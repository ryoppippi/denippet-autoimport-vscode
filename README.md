# denippet-autoimport-vscode

The simple module to autoload VS Code-like snippets on runtime path automatically.


## Requirements

- [Denippet.vim](https://github.com/uga-rosa/denippet.vim)
- [Denops.vim](https://github.com/vim-denops/denops.vim)

## Features

## Installation

If you are using lazy.nvim

```lua
return {
    "ryoppippi/denippet-autoimport-vscode",
    event = { "InsertEnter", "User DenopsReady" },
    dependencies = {
        "vim-denops/denops.vim",
        "rafamadriz/friendly-snippets", -- your favorite VS Code-like snippet collection
    },
}

```

That's it! This plugin loads your snippets automatically!

## Configuration

No additional configuration is required. The module automatically scans all runtime paths for VSCode snippet configurations and loads them accordingly.

### Commands

After initialization, when you want to reload snipepts, run the following command:

```vim
:DenippetReloadVSCodeSnippet
```

This command ensures that all snippets are up-to-date and loaded into the active Denippet.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 

## Credits

This project is developed and maintained by Ryotaro "Justin" Kimura. Contributions are welcome to improve the functionality and scope of snippet management within the Denops ecosystem.
