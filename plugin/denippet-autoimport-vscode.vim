if exists('g:loaded_denippet_autoimport_vscode')
  finish
endif

let g:loaded_denippet_autoimport_vscode = 1

function s:notify(method, params = [ ]) abort
  call denops#plugin#wait_async('denippet-autoimport-vscode', {
        \ -> denops#notify('denippet-autoimport-vscode', a:method, a:params)
        \})
endfunction

function s:load() abort
  call s:notify('load')
endfunction

command! -nargs=0 DenippetReloadVSCodeSnippet call s:load()

if exists('g:loaded_denippet')
  execute 'DenippetReloadVSCodeSnippet'
endif

autocmd! User DenopsPluginPost:denippet ++once execute 'DenippetReloadVSCodeSnippet'
