




<!DOCTYPE html>
<html class="   ">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    
    <title>angular-translate/src/service/loader-partial.js at master · angular-translate/angular-translate · GitHub</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" />
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png" />
    <meta property="fb:app_id" content="1401488693436528"/>

      <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="angular-translate/angular-translate" name="twitter:title" /><meta content="angular-translate - i18n in your Angular apps, made easy." name="twitter:description" /><meta content="https://avatars2.githubusercontent.com/u/6117835?s=400" name="twitter:image:src" />
<meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars2.githubusercontent.com/u/6117835?s=400" property="og:image" /><meta content="angular-translate/angular-translate" property="og:title" /><meta content="https://github.com/angular-translate/angular-translate" property="og:url" /><meta content="angular-translate - i18n in your Angular apps, made easy." property="og:description" />

    <link rel="assets" href="https://github.global.ssl.fastly.net/">
    <link rel="conduit-xhr" href="https://ghconduit.com:25035/">
    <link rel="xhr-socket" href="/_sockets" />

    <meta name="msapplication-TileImage" content="/windows-tile.png" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="selected-link" value="repo_source" data-pjax-transient />
    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="2EA5C41B:2232:5C3D7:534E7868" name="octolytics-dimension-request_id" />
    

    
    
    <link rel="icon" type="image/x-icon" href="https://github.global.ssl.fastly.net/favicon.ico" />

    <meta content="authenticity_token" name="csrf-param" />
<meta content="m+EDhwpNDQHiVkhW8PdMdnns60TKGIiHoSpor1nutVo=" name="csrf-token" />

    <link href="https://github.global.ssl.fastly.net/assets/github-5d6b64e5772c2383deb1cdbd2139d2e5f00143c5.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://github.global.ssl.fastly.net/assets/github2-b777afd5062bd9e212fcc78e4009a8cbb197c4f7.css" media="all" rel="stylesheet" type="text/css" />
    


        <script crossorigin="anonymous" src="https://github.global.ssl.fastly.net/assets/frameworks-28954a03feefcefacd684187f9478c307b78afe0.js" type="text/javascript"></script>
        <script async="async" crossorigin="anonymous" src="https://github.global.ssl.fastly.net/assets/github-d45a10ee8c9a47461c1483487d40f5852bedf671.js" type="text/javascript"></script>
        
        
      <meta http-equiv="x-pjax-version" content="ab39c9160defde9db2c9121925483493">

        <link data-pjax-transient rel='permalink' href='/angular-translate/angular-translate/blob/702cb5e07e9ee1f2eb19fefc33068b744f380500/src/service/loader-partial.js'>

  <meta name="description" content="angular-translate - i18n in your Angular apps, made easy." />

  <meta content="6117835" name="octolytics-dimension-user_id" /><meta content="angular-translate" name="octolytics-dimension-user_login" /><meta content="9076111" name="octolytics-dimension-repository_id" /><meta content="angular-translate/angular-translate" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="9076111" name="octolytics-dimension-repository_network_root_id" /><meta content="angular-translate/angular-translate" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/angular-translate/angular-translate/commits/master.atom" rel="alternate" title="Recent Commits to angular-translate:master" type="application/atom+xml" />

  </head>


  <body class="logged_out  env-production macintosh vis-public page-blob">
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>
    <div class="wrapper">
      
      
      
      


      
      <div class="header header-logged-out">
  <div class="container clearfix">

    <a class="header-logo-wordmark" href="https://github.com/">
      <span class="mega-octicon octicon-logo-github"></span>
    </a>

    <div class="header-actions">
        <a class="button primary" href="/join">Sign up</a>
      <a class="button signin" href="/login?return_to=%2Fangular-translate%2Fangular-translate%2Fblob%2Fmaster%2Fsrc%2Fservice%2Floader-partial.js">Sign in</a>
    </div>

    <div class="command-bar js-command-bar  in-repository">

      <ul class="top-nav">
          <li class="explore"><a href="/explore">Explore</a></li>
        <li class="features"><a href="/features">Features</a></li>
          <li class="enterprise"><a href="https://enterprise.github.com/">Enterprise</a></li>
          <li class="blog"><a href="/blog">Blog</a></li>
      </ul>
        <form accept-charset="UTF-8" action="/search" class="command-bar-form" id="top_search_form" method="get">

<div class="commandbar">
  <span class="message"></span>
  <input type="text" data-hotkey="/ s" name="q" id="js-command-bar-field" placeholder="Search or type a command" tabindex="1" autocapitalize="off"
    
    
      data-repo="angular-translate/angular-translate"
      data-branch="master"
      data-sha="2d74aea17dea42d452f40bf323671be8ad94045c"
  >
  <div class="display hidden"></div>
</div>

    <input type="hidden" name="nwo" value="angular-translate/angular-translate" />

    <div class="select-menu js-menu-container js-select-menu search-context-select-menu">
      <span class="minibutton select-menu-button js-menu-target" role="button" aria-haspopup="true">
        <span class="js-select-button">This repository</span>
      </span>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container" aria-hidden="true">
        <div class="select-menu-modal">

          <div class="select-menu-item js-navigation-item js-this-repository-navigation-item selected">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" class="js-search-this-repository" name="search_target" value="repository" checked="checked" />
            <div class="select-menu-item-text js-select-button-text">This repository</div>
          </div> <!-- /.select-menu-item -->

          <div class="select-menu-item js-navigation-item js-all-repositories-navigation-item">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" name="search_target" value="global" />
            <div class="select-menu-item-text js-select-button-text">All repositories</div>
          </div> <!-- /.select-menu-item -->

        </div>
      </div>
    </div>

  <span class="help tooltipped tooltipped-s" aria-label="Show command bar help">
    <span class="octicon octicon-question"></span>
  </span>


  <input type="hidden" name="ref" value="cmdform">

</form>
    </div>

  </div>
</div>



      <div id="start-of-content" class="accessibility-aid"></div>
          <div class="site" itemscope itemtype="http://schema.org/WebPage">
    
    <div class="pagehead repohead instapaper_ignore readability-menu">
      <div class="container">
        

<ul class="pagehead-actions">


  <li>
    <a href="/login?return_to=%2Fangular-translate%2Fangular-translate"
    class="minibutton with-count js-toggler-target star-button tooltipped tooltipped-n"
    aria-label="You must be signed in to star a repository" rel="nofollow">
    <span class="octicon octicon-star"></span>Star
  </a>

    <a class="social-count js-social-count" href="/angular-translate/angular-translate/stargazers">
      1,191
    </a>

  </li>

    <li>
      <a href="/login?return_to=%2Fangular-translate%2Fangular-translate"
        class="minibutton with-count js-toggler-target fork-button tooltipped tooltipped-n"
        aria-label="You must be signed in to fork a repository" rel="nofollow">
        <span class="octicon octicon-git-branch"></span>Fork
      </a>
      <a href="/angular-translate/angular-translate/network" class="social-count">
        143
      </a>
    </li>
</ul>

        <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
          <span class="repo-label"><span>public</span></span>
          <span class="mega-octicon octicon-repo"></span>
          <span class="author"><a href="/angular-translate" class="url fn" itemprop="url" rel="author"><span itemprop="title">angular-translate</span></a></span><!--
       --><span class="path-divider">/</span><!--
       --><strong><a href="/angular-translate/angular-translate" class="js-current-repository js-repo-home-link">angular-translate</a></strong>

          <span class="page-context-loader">
            <img alt="Octocat-spinner-32" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
          </span>

        </h1>
      </div><!-- /.container -->
    </div><!-- /.repohead -->

    <div class="container">
      <div class="repository-with-sidebar repo-container new-discussion-timeline js-new-discussion-timeline  ">
        <div class="repository-sidebar clearfix">
            

<div class="sunken-menu vertical-right repo-nav js-repo-nav js-repository-container-pjax js-octicon-loaders">
  <div class="sunken-menu-contents">
    <ul class="sunken-menu-group">
      <li class="tooltipped tooltipped-w" aria-label="Code">
        <a href="/angular-translate/angular-translate" aria-label="Code" class="selected js-selected-navigation-item sunken-menu-item" data-gotokey="c" data-pjax="true" data-selected-links="repo_source repo_downloads repo_commits repo_tags repo_branches /angular-translate/angular-translate">
          <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

        <li class="tooltipped tooltipped-w" aria-label="Issues">
          <a href="/angular-translate/angular-translate/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-gotokey="i" data-selected-links="repo_issues /angular-translate/angular-translate/issues">
            <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
            <span class='counter'>66</span>
            <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>        </li>

      <li class="tooltipped tooltipped-w" aria-label="Pull Requests">
        <a href="/angular-translate/angular-translate/pulls" aria-label="Pull Requests" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-gotokey="p" data-selected-links="repo_pulls /angular-translate/angular-translate/pulls">
            <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull Requests</span>
            <span class='counter'>12</span>
            <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>


        <li class="tooltipped tooltipped-w" aria-label="Wiki">
          <a href="/angular-translate/angular-translate/wiki" aria-label="Wiki" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="repo_wiki /angular-translate/angular-translate/wiki">
            <span class="octicon octicon-book"></span> <span class="full-word">Wiki</span>
            <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>        </li>
    </ul>
    <div class="sunken-menu-separator"></div>
    <ul class="sunken-menu-group">

      <li class="tooltipped tooltipped-w" aria-label="Pulse">
        <a href="/angular-translate/angular-translate/pulse" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="pulse /angular-translate/angular-translate/pulse">
          <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

      <li class="tooltipped tooltipped-w" aria-label="Graphs">
        <a href="/angular-translate/angular-translate/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="repo_graphs repo_contributors /angular-translate/angular-translate/graphs">
          <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

      <li class="tooltipped tooltipped-w" aria-label="Network">
        <a href="/angular-translate/angular-translate/network" aria-label="Network" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-selected-links="repo_network /angular-translate/angular-translate/network">
          <span class="octicon octicon-git-branch"></span> <span class="full-word">Network</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>
    </ul>


  </div>
</div>

              <div class="only-with-full-nav">
                

  

<div class="clone-url open"
  data-protocol-type="http"
  data-url="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone">
  <h3><strong>HTTPS</strong> clone URL</h3>
  <div class="clone-url-box">
    <input type="text" class="clone js-url-field"
           value="https://github.com/angular-translate/angular-translate.git" readonly="readonly">

    <span aria-label="copy to clipboard" class="js-zeroclipboard url-box-clippy minibutton zeroclipboard-button" data-clipboard-text="https://github.com/angular-translate/angular-translate.git" data-copied-hint="copied!"><span class="octicon octicon-clippy"></span></span>
  </div>
</div>

  

<div class="clone-url "
  data-protocol-type="subversion"
  data-url="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone">
  <h3><strong>Subversion</strong> checkout URL</h3>
  <div class="clone-url-box">
    <input type="text" class="clone js-url-field"
           value="https://github.com/angular-translate/angular-translate" readonly="readonly">

    <span aria-label="copy to clipboard" class="js-zeroclipboard url-box-clippy minibutton zeroclipboard-button" data-clipboard-text="https://github.com/angular-translate/angular-translate" data-copied-hint="copied!"><span class="octicon octicon-clippy"></span></span>
  </div>
</div>


<p class="clone-options">You can clone with
      <a href="#" class="js-clone-selector" data-protocol="http">HTTPS</a>
      or <a href="#" class="js-clone-selector" data-protocol="subversion">Subversion</a>.
  <span class="help tooltipped tooltipped-n" aria-label="Get help on which URL is right for you.">
    <a href="https://help.github.com/articles/which-remote-url-should-i-use">
    <span class="octicon octicon-question"></span>
    </a>
  </span>
</p>

  <a href="http://mac.github.com" data-url="github-mac://openRepo/https://github.com/angular-translate/angular-translate" class="minibutton sidebar-button js-conduit-rewrite-url" title="Save angular-translate/angular-translate to your computer and use it in GitHub Desktop." aria-label="Save angular-translate/angular-translate to your computer and use it in GitHub Desktop.">
    <span class="octicon octicon-device-desktop"></span>
    Clone in Desktop
  </a>


                <a href="/angular-translate/angular-translate/archive/master.zip"
                   class="minibutton sidebar-button"
                   aria-label="Download angular-translate/angular-translate as a zip file"
                   title="Download angular-translate/angular-translate as a zip file"
                   rel="nofollow">
                  <span class="octicon octicon-cloud-download"></span>
                  Download ZIP
                </a>
              </div>
        </div><!-- /.repository-sidebar -->

        <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>
          


<!-- blob contrib key: blob_contributors:v21:c62a702f2a7183ab73ca5b2a41c5f16c -->

<p title="This is a placeholder element" class="js-history-link-replace hidden"></p>

<a href="/angular-translate/angular-translate/find/master" data-pjax data-hotkey="t" class="js-show-file-finder" style="display:none">Show File Finder</a>

<div class="file-navigation">
  

<div class="select-menu js-menu-container js-select-menu" >
  <span class="minibutton select-menu-button js-menu-target" data-hotkey="w"
    data-master-branch="master"
    data-ref="master"
    role="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <span class="octicon octicon-git-branch"></span>
    <i>branch:</i>
    <span class="js-select-button">master</span>
  </span>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span class="select-menu-title">Switch branches/tags</span>
        <span class="octicon octicon-remove-close js-menu-close"></span>
      </div> <!-- /.select-menu-header -->

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
            </li>
          </ul>
        </div><!-- /.select-menu-tabs -->
      </div><!-- /.select-menu-filters -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/async-storages/src/service/loader-partial.js"
                 data-name="async-storages"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="async-storages">async-storages</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/canary/src/service/loader-partial.js"
                 data-name="canary"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="canary">canary</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/docs-improvements/src/service/loader-partial.js"
                 data-name="docs-improvements"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="docs-improvements">docs-improvements</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/dutch-docs/src/service/loader-partial.js"
                 data-name="dutch-docs"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="dutch-docs">dutch-docs</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/extract-engine/src/service/loader-partial.js"
                 data-name="extract-engine"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="extract-engine">extract-engine</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/fallback-languages/src/service/loader-partial.js"
                 data-name="fallback-languages"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="fallback-languages">fallback-languages</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/fix-async-loading/src/service/loader-partial.js"
                 data-name="fix-async-loading"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="fix-async-loading">fix-async-loading</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/french-docs/src/service/loader-partial.js"
                 data-name="french-docs"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="french-docs">french-docs</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/iss/120/src/service/loader-partial.js"
                 data-name="iss/120"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="iss/120">iss/120</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item selected">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/master/src/service/loader-partial.js"
                 data-name="master"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="master">master</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/module-name/src/service/loader-partial.js"
                 data-name="module-name"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="module-name">module-name</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/registerStorageFactory/src/service/loader-partial.js"
                 data-name="registerStorageFactory"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="registerStorageFactory">registerStorageFactory</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/blob/transform-interceptor/src/service/loader-partial.js"
                 data-name="transform-interceptor"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="transform-interceptor">transform-interceptor</a>
            </div> <!-- /.select-menu-item -->
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/2.1.0/src/service/loader-partial.js"
                 data-name="2.1.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="2.1.0">2.1.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/2.0.1/src/service/loader-partial.js"
                 data-name="2.0.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="2.0.1">2.0.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/2.0.0/src/service/loader-partial.js"
                 data-name="2.0.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="2.0.0">2.0.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/1.1.1/src/service/loader-partial.js"
                 data-name="1.1.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="1.1.1">1.1.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/1.1.0/src/service/loader-partial.js"
                 data-name="1.1.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="1.1.0">1.1.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/1.0.2/src/service/loader-partial.js"
                 data-name="1.0.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="1.0.2">1.0.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/1.0.1/src/service/loader-partial.js"
                 data-name="1.0.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="1.0.1">1.0.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/1.0.0/src/service/loader-partial.js"
                 data-name="1.0.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="1.0.0">1.0.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.9.4/src/service/loader-partial.js"
                 data-name="0.9.4"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.9.4">0.9.4</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.9.3/src/service/loader-partial.js"
                 data-name="0.9.3"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.9.3">0.9.3</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.9.2/src/service/loader-partial.js"
                 data-name="0.9.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.9.2">0.9.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.9.1/src/service/loader-partial.js"
                 data-name="0.9.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.9.1">0.9.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.9.0/src/service/loader-partial.js"
                 data-name="0.9.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.9.0">0.9.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.8.1/src/service/loader-partial.js"
                 data-name="0.8.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.8.1">0.8.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.8.0/src/service/loader-partial.js"
                 data-name="0.8.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.8.0">0.8.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.7.1/src/service/loader-partial.js"
                 data-name="0.7.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.7.1">0.7.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.7.0/src/service/loader-partial.js"
                 data-name="0.7.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.7.0">0.7.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.6.0/src/service/loader-partial.js"
                 data-name="0.6.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.6.0">0.6.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.5.2/src/service/loader-partial.js"
                 data-name="0.5.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.5.2">0.5.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.5.1/src/service/loader-partial.js"
                 data-name="0.5.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.5.1">0.5.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.5.0/src/service/loader-partial.js"
                 data-name="0.5.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.5.0">0.5.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.4.4/src/service/loader-partial.js"
                 data-name="0.4.4"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.4.4">0.4.4</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.4.2/src/service/loader-partial.js"
                 data-name="0.4.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.4.2">0.4.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.4.0/src/service/loader-partial.js"
                 data-name="0.4.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.4.0">0.4.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.3.0/src/service/loader-partial.js"
                 data-name="0.3.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.3.0">0.3.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.2.1/src/service/loader-partial.js"
                 data-name="0.2.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.2.1">0.2.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.2.0/src/service/loader-partial.js"
                 data-name="0.2.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.2.0">0.2.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.1.2/src/service/loader-partial.js"
                 data-name="0.1.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.1.2">0.1.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.1.1/src/service/loader-partial.js"
                 data-name="0.1.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.1.1">0.1.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.1.0/src/service/loader-partial.js"
                 data-name="0.1.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.1.0">0.1.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.0.5/src/service/loader-partial.js"
                 data-name="0.0.5"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.0.5">0.0.5</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.0.4/src/service/loader-partial.js"
                 data-name="0.0.4"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.0.4">0.0.4</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.0.2/src/service/loader-partial.js"
                 data-name="0.0.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.0.2">0.0.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/angular-translate/angular-translate/tree/0.0.1/src/service/loader-partial.js"
                 data-name="0.0.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="0.0.1">0.0.1</a>
            </div> <!-- /.select-menu-item -->
        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

    </div> <!-- /.select-menu-modal -->
  </div> <!-- /.select-menu-modal-holder -->
</div> <!-- /.select-menu -->

  <div class="breadcrumb">
    <span class='repo-root js-repo-root'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/angular-translate/angular-translate" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">angular-translate</span></a></span></span><span class="separator"> / </span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/angular-translate/angular-translate/tree/master/src" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">src</span></a></span><span class="separator"> / </span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/angular-translate/angular-translate/tree/master/src/service" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">service</span></a></span><span class="separator"> / </span><strong class="final-path">loader-partial.js</strong> <span aria-label="copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-clipboard-text="src/service/loader-partial.js" data-copied-hint="copied!"><span class="octicon octicon-clippy"></span></span>
  </div>
</div>


  <div class="commit file-history-tease">
    <img alt="Pascal Precht" class="main-avatar js-avatar" data-user="445106" height="24" src="https://avatars2.githubusercontent.com/u/445106?s=140" width="24" />
    <span class="author"><a href="/PascalPrecht" rel="author">PascalPrecht</a></span>
    <time class="js-relative-date" data-title-format="YYYY-MM-DD HH:mm:ss" datetime="2014-02-02T11:26:08+01:00" title="2014-02-02 15:56:08">February 02, 2014</time>
    <div class="commit-title">
        <a href="/angular-translate/angular-translate/commit/d6ea84be099ce632557c49d63d3d80d08641c545" class="message" data-pjax="true" title="fix($translatePartialLoader): fixes docs annotation">fix($translatePartialLoader): fixes docs annotation</a>
    </div>

    <div class="participation">
      <p class="quickstat"><a href="#blob_contributors_box" rel="facebox"><strong>3</strong>  contributors</a></p>
          <a class="avatar tooltipped tooltipped-s" aria-label="DWand" href="/angular-translate/angular-translate/commits/master/src/service/loader-partial.js?author=DWand"><img alt="Max Prychynenko" class=" js-avatar" data-user="4358089" height="20" src="https://avatars0.githubusercontent.com/u/4358089?s=140" width="20" /></a>
    <a class="avatar tooltipped tooltipped-s" aria-label="PascalPrecht" href="/angular-translate/angular-translate/commits/master/src/service/loader-partial.js?author=PascalPrecht"><img alt="Pascal Precht" class=" js-avatar" data-user="445106" height="20" src="https://avatars2.githubusercontent.com/u/445106?s=140" width="20" /></a>
    <a class="avatar tooltipped tooltipped-s" aria-label="HolgerPersch" href="/angular-translate/angular-translate/commits/master/src/service/loader-partial.js?author=HolgerPersch"><img alt="HolgerPersch" class=" js-avatar" data-user="5908383" height="20" src="https://avatars1.githubusercontent.com/u/5908383?s=140" width="20" /></a>


    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list">
          <li class="facebox-user-list-item">
            <img alt="Max Prychynenko" class=" js-avatar" data-user="4358089" height="24" src="https://avatars0.githubusercontent.com/u/4358089?s=140" width="24" />
            <a href="/DWand">DWand</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="Pascal Precht" class=" js-avatar" data-user="445106" height="24" src="https://avatars2.githubusercontent.com/u/445106?s=140" width="24" />
            <a href="/PascalPrecht">PascalPrecht</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="HolgerPersch" class=" js-avatar" data-user="5908383" height="24" src="https://avatars1.githubusercontent.com/u/5908383?s=140" width="24" />
            <a href="/HolgerPersch">HolgerPersch</a>
          </li>
      </ul>
    </div>
  </div>

<div class="file-box">
  <div class="file">
    <div class="meta clearfix">
      <div class="info file-name">
        <span class="icon"><b class="octicon octicon-file-text"></b></span>
        <span class="mode" title="File Mode">file</span>
        <span class="meta-divider"></span>
          <span>426 lines (380 sloc)</span>
          <span class="meta-divider"></span>
        <span>14.913 kb</span>
      </div>
      <div class="actions">
        <div class="button-group">
            <a class="minibutton tooltipped tooltipped-w js-conduit-openfile-check"
               href="http://mac.github.com"
               data-url="github-mac://openRepo/https://github.com/angular-translate/angular-translate?branch=master&amp;filepath=src%2Fservice%2Floader-partial.js"
               aria-label="Open this file in GitHub for Mac"
               data-failed-title="Your version of GitHub for Mac is too old to open this file. Try checking for updates.">
                <span class="octicon octicon-device-desktop"></span> Open
            </a>
              <a class="minibutton disabled tooltipped tooltipped-w" href="#"
                 aria-label="You must be signed in to make or propose changes">Edit</a>
          <a href="/angular-translate/angular-translate/raw/master/src/service/loader-partial.js" class="button minibutton " id="raw-url">Raw</a>
            <a href="/angular-translate/angular-translate/blame/master/src/service/loader-partial.js" class="button minibutton js-update-url-with-hash">Blame</a>
          <a href="/angular-translate/angular-translate/commits/master/src/service/loader-partial.js" class="button minibutton " rel="nofollow">History</a>
        </div><!-- /.button-group -->
          <a class="minibutton danger disabled empty-icon tooltipped tooltipped-w" href="#"
             aria-label="You must be signed in to make or propose changes">
          Delete
        </a>
      </div><!-- /.actions -->
    </div>
        <div class="blob-wrapper data type-javascript js-blob-data">
        <table class="file-code file-diff tab-size-8">
          <tr class="file-code-line">
            <td class="blob-line-nums">
              <span id="L1" rel="#L1">1</span>
<span id="L2" rel="#L2">2</span>
<span id="L3" rel="#L3">3</span>
<span id="L4" rel="#L4">4</span>
<span id="L5" rel="#L5">5</span>
<span id="L6" rel="#L6">6</span>
<span id="L7" rel="#L7">7</span>
<span id="L8" rel="#L8">8</span>
<span id="L9" rel="#L9">9</span>
<span id="L10" rel="#L10">10</span>
<span id="L11" rel="#L11">11</span>
<span id="L12" rel="#L12">12</span>
<span id="L13" rel="#L13">13</span>
<span id="L14" rel="#L14">14</span>
<span id="L15" rel="#L15">15</span>
<span id="L16" rel="#L16">16</span>
<span id="L17" rel="#L17">17</span>
<span id="L18" rel="#L18">18</span>
<span id="L19" rel="#L19">19</span>
<span id="L20" rel="#L20">20</span>
<span id="L21" rel="#L21">21</span>
<span id="L22" rel="#L22">22</span>
<span id="L23" rel="#L23">23</span>
<span id="L24" rel="#L24">24</span>
<span id="L25" rel="#L25">25</span>
<span id="L26" rel="#L26">26</span>
<span id="L27" rel="#L27">27</span>
<span id="L28" rel="#L28">28</span>
<span id="L29" rel="#L29">29</span>
<span id="L30" rel="#L30">30</span>
<span id="L31" rel="#L31">31</span>
<span id="L32" rel="#L32">32</span>
<span id="L33" rel="#L33">33</span>
<span id="L34" rel="#L34">34</span>
<span id="L35" rel="#L35">35</span>
<span id="L36" rel="#L36">36</span>
<span id="L37" rel="#L37">37</span>
<span id="L38" rel="#L38">38</span>
<span id="L39" rel="#L39">39</span>
<span id="L40" rel="#L40">40</span>
<span id="L41" rel="#L41">41</span>
<span id="L42" rel="#L42">42</span>
<span id="L43" rel="#L43">43</span>
<span id="L44" rel="#L44">44</span>
<span id="L45" rel="#L45">45</span>
<span id="L46" rel="#L46">46</span>
<span id="L47" rel="#L47">47</span>
<span id="L48" rel="#L48">48</span>
<span id="L49" rel="#L49">49</span>
<span id="L50" rel="#L50">50</span>
<span id="L51" rel="#L51">51</span>
<span id="L52" rel="#L52">52</span>
<span id="L53" rel="#L53">53</span>
<span id="L54" rel="#L54">54</span>
<span id="L55" rel="#L55">55</span>
<span id="L56" rel="#L56">56</span>
<span id="L57" rel="#L57">57</span>
<span id="L58" rel="#L58">58</span>
<span id="L59" rel="#L59">59</span>
<span id="L60" rel="#L60">60</span>
<span id="L61" rel="#L61">61</span>
<span id="L62" rel="#L62">62</span>
<span id="L63" rel="#L63">63</span>
<span id="L64" rel="#L64">64</span>
<span id="L65" rel="#L65">65</span>
<span id="L66" rel="#L66">66</span>
<span id="L67" rel="#L67">67</span>
<span id="L68" rel="#L68">68</span>
<span id="L69" rel="#L69">69</span>
<span id="L70" rel="#L70">70</span>
<span id="L71" rel="#L71">71</span>
<span id="L72" rel="#L72">72</span>
<span id="L73" rel="#L73">73</span>
<span id="L74" rel="#L74">74</span>
<span id="L75" rel="#L75">75</span>
<span id="L76" rel="#L76">76</span>
<span id="L77" rel="#L77">77</span>
<span id="L78" rel="#L78">78</span>
<span id="L79" rel="#L79">79</span>
<span id="L80" rel="#L80">80</span>
<span id="L81" rel="#L81">81</span>
<span id="L82" rel="#L82">82</span>
<span id="L83" rel="#L83">83</span>
<span id="L84" rel="#L84">84</span>
<span id="L85" rel="#L85">85</span>
<span id="L86" rel="#L86">86</span>
<span id="L87" rel="#L87">87</span>
<span id="L88" rel="#L88">88</span>
<span id="L89" rel="#L89">89</span>
<span id="L90" rel="#L90">90</span>
<span id="L91" rel="#L91">91</span>
<span id="L92" rel="#L92">92</span>
<span id="L93" rel="#L93">93</span>
<span id="L94" rel="#L94">94</span>
<span id="L95" rel="#L95">95</span>
<span id="L96" rel="#L96">96</span>
<span id="L97" rel="#L97">97</span>
<span id="L98" rel="#L98">98</span>
<span id="L99" rel="#L99">99</span>
<span id="L100" rel="#L100">100</span>
<span id="L101" rel="#L101">101</span>
<span id="L102" rel="#L102">102</span>
<span id="L103" rel="#L103">103</span>
<span id="L104" rel="#L104">104</span>
<span id="L105" rel="#L105">105</span>
<span id="L106" rel="#L106">106</span>
<span id="L107" rel="#L107">107</span>
<span id="L108" rel="#L108">108</span>
<span id="L109" rel="#L109">109</span>
<span id="L110" rel="#L110">110</span>
<span id="L111" rel="#L111">111</span>
<span id="L112" rel="#L112">112</span>
<span id="L113" rel="#L113">113</span>
<span id="L114" rel="#L114">114</span>
<span id="L115" rel="#L115">115</span>
<span id="L116" rel="#L116">116</span>
<span id="L117" rel="#L117">117</span>
<span id="L118" rel="#L118">118</span>
<span id="L119" rel="#L119">119</span>
<span id="L120" rel="#L120">120</span>
<span id="L121" rel="#L121">121</span>
<span id="L122" rel="#L122">122</span>
<span id="L123" rel="#L123">123</span>
<span id="L124" rel="#L124">124</span>
<span id="L125" rel="#L125">125</span>
<span id="L126" rel="#L126">126</span>
<span id="L127" rel="#L127">127</span>
<span id="L128" rel="#L128">128</span>
<span id="L129" rel="#L129">129</span>
<span id="L130" rel="#L130">130</span>
<span id="L131" rel="#L131">131</span>
<span id="L132" rel="#L132">132</span>
<span id="L133" rel="#L133">133</span>
<span id="L134" rel="#L134">134</span>
<span id="L135" rel="#L135">135</span>
<span id="L136" rel="#L136">136</span>
<span id="L137" rel="#L137">137</span>
<span id="L138" rel="#L138">138</span>
<span id="L139" rel="#L139">139</span>
<span id="L140" rel="#L140">140</span>
<span id="L141" rel="#L141">141</span>
<span id="L142" rel="#L142">142</span>
<span id="L143" rel="#L143">143</span>
<span id="L144" rel="#L144">144</span>
<span id="L145" rel="#L145">145</span>
<span id="L146" rel="#L146">146</span>
<span id="L147" rel="#L147">147</span>
<span id="L148" rel="#L148">148</span>
<span id="L149" rel="#L149">149</span>
<span id="L150" rel="#L150">150</span>
<span id="L151" rel="#L151">151</span>
<span id="L152" rel="#L152">152</span>
<span id="L153" rel="#L153">153</span>
<span id="L154" rel="#L154">154</span>
<span id="L155" rel="#L155">155</span>
<span id="L156" rel="#L156">156</span>
<span id="L157" rel="#L157">157</span>
<span id="L158" rel="#L158">158</span>
<span id="L159" rel="#L159">159</span>
<span id="L160" rel="#L160">160</span>
<span id="L161" rel="#L161">161</span>
<span id="L162" rel="#L162">162</span>
<span id="L163" rel="#L163">163</span>
<span id="L164" rel="#L164">164</span>
<span id="L165" rel="#L165">165</span>
<span id="L166" rel="#L166">166</span>
<span id="L167" rel="#L167">167</span>
<span id="L168" rel="#L168">168</span>
<span id="L169" rel="#L169">169</span>
<span id="L170" rel="#L170">170</span>
<span id="L171" rel="#L171">171</span>
<span id="L172" rel="#L172">172</span>
<span id="L173" rel="#L173">173</span>
<span id="L174" rel="#L174">174</span>
<span id="L175" rel="#L175">175</span>
<span id="L176" rel="#L176">176</span>
<span id="L177" rel="#L177">177</span>
<span id="L178" rel="#L178">178</span>
<span id="L179" rel="#L179">179</span>
<span id="L180" rel="#L180">180</span>
<span id="L181" rel="#L181">181</span>
<span id="L182" rel="#L182">182</span>
<span id="L183" rel="#L183">183</span>
<span id="L184" rel="#L184">184</span>
<span id="L185" rel="#L185">185</span>
<span id="L186" rel="#L186">186</span>
<span id="L187" rel="#L187">187</span>
<span id="L188" rel="#L188">188</span>
<span id="L189" rel="#L189">189</span>
<span id="L190" rel="#L190">190</span>
<span id="L191" rel="#L191">191</span>
<span id="L192" rel="#L192">192</span>
<span id="L193" rel="#L193">193</span>
<span id="L194" rel="#L194">194</span>
<span id="L195" rel="#L195">195</span>
<span id="L196" rel="#L196">196</span>
<span id="L197" rel="#L197">197</span>
<span id="L198" rel="#L198">198</span>
<span id="L199" rel="#L199">199</span>
<span id="L200" rel="#L200">200</span>
<span id="L201" rel="#L201">201</span>
<span id="L202" rel="#L202">202</span>
<span id="L203" rel="#L203">203</span>
<span id="L204" rel="#L204">204</span>
<span id="L205" rel="#L205">205</span>
<span id="L206" rel="#L206">206</span>
<span id="L207" rel="#L207">207</span>
<span id="L208" rel="#L208">208</span>
<span id="L209" rel="#L209">209</span>
<span id="L210" rel="#L210">210</span>
<span id="L211" rel="#L211">211</span>
<span id="L212" rel="#L212">212</span>
<span id="L213" rel="#L213">213</span>
<span id="L214" rel="#L214">214</span>
<span id="L215" rel="#L215">215</span>
<span id="L216" rel="#L216">216</span>
<span id="L217" rel="#L217">217</span>
<span id="L218" rel="#L218">218</span>
<span id="L219" rel="#L219">219</span>
<span id="L220" rel="#L220">220</span>
<span id="L221" rel="#L221">221</span>
<span id="L222" rel="#L222">222</span>
<span id="L223" rel="#L223">223</span>
<span id="L224" rel="#L224">224</span>
<span id="L225" rel="#L225">225</span>
<span id="L226" rel="#L226">226</span>
<span id="L227" rel="#L227">227</span>
<span id="L228" rel="#L228">228</span>
<span id="L229" rel="#L229">229</span>
<span id="L230" rel="#L230">230</span>
<span id="L231" rel="#L231">231</span>
<span id="L232" rel="#L232">232</span>
<span id="L233" rel="#L233">233</span>
<span id="L234" rel="#L234">234</span>
<span id="L235" rel="#L235">235</span>
<span id="L236" rel="#L236">236</span>
<span id="L237" rel="#L237">237</span>
<span id="L238" rel="#L238">238</span>
<span id="L239" rel="#L239">239</span>
<span id="L240" rel="#L240">240</span>
<span id="L241" rel="#L241">241</span>
<span id="L242" rel="#L242">242</span>
<span id="L243" rel="#L243">243</span>
<span id="L244" rel="#L244">244</span>
<span id="L245" rel="#L245">245</span>
<span id="L246" rel="#L246">246</span>
<span id="L247" rel="#L247">247</span>
<span id="L248" rel="#L248">248</span>
<span id="L249" rel="#L249">249</span>
<span id="L250" rel="#L250">250</span>
<span id="L251" rel="#L251">251</span>
<span id="L252" rel="#L252">252</span>
<span id="L253" rel="#L253">253</span>
<span id="L254" rel="#L254">254</span>
<span id="L255" rel="#L255">255</span>
<span id="L256" rel="#L256">256</span>
<span id="L257" rel="#L257">257</span>
<span id="L258" rel="#L258">258</span>
<span id="L259" rel="#L259">259</span>
<span id="L260" rel="#L260">260</span>
<span id="L261" rel="#L261">261</span>
<span id="L262" rel="#L262">262</span>
<span id="L263" rel="#L263">263</span>
<span id="L264" rel="#L264">264</span>
<span id="L265" rel="#L265">265</span>
<span id="L266" rel="#L266">266</span>
<span id="L267" rel="#L267">267</span>
<span id="L268" rel="#L268">268</span>
<span id="L269" rel="#L269">269</span>
<span id="L270" rel="#L270">270</span>
<span id="L271" rel="#L271">271</span>
<span id="L272" rel="#L272">272</span>
<span id="L273" rel="#L273">273</span>
<span id="L274" rel="#L274">274</span>
<span id="L275" rel="#L275">275</span>
<span id="L276" rel="#L276">276</span>
<span id="L277" rel="#L277">277</span>
<span id="L278" rel="#L278">278</span>
<span id="L279" rel="#L279">279</span>
<span id="L280" rel="#L280">280</span>
<span id="L281" rel="#L281">281</span>
<span id="L282" rel="#L282">282</span>
<span id="L283" rel="#L283">283</span>
<span id="L284" rel="#L284">284</span>
<span id="L285" rel="#L285">285</span>
<span id="L286" rel="#L286">286</span>
<span id="L287" rel="#L287">287</span>
<span id="L288" rel="#L288">288</span>
<span id="L289" rel="#L289">289</span>
<span id="L290" rel="#L290">290</span>
<span id="L291" rel="#L291">291</span>
<span id="L292" rel="#L292">292</span>
<span id="L293" rel="#L293">293</span>
<span id="L294" rel="#L294">294</span>
<span id="L295" rel="#L295">295</span>
<span id="L296" rel="#L296">296</span>
<span id="L297" rel="#L297">297</span>
<span id="L298" rel="#L298">298</span>
<span id="L299" rel="#L299">299</span>
<span id="L300" rel="#L300">300</span>
<span id="L301" rel="#L301">301</span>
<span id="L302" rel="#L302">302</span>
<span id="L303" rel="#L303">303</span>
<span id="L304" rel="#L304">304</span>
<span id="L305" rel="#L305">305</span>
<span id="L306" rel="#L306">306</span>
<span id="L307" rel="#L307">307</span>
<span id="L308" rel="#L308">308</span>
<span id="L309" rel="#L309">309</span>
<span id="L310" rel="#L310">310</span>
<span id="L311" rel="#L311">311</span>
<span id="L312" rel="#L312">312</span>
<span id="L313" rel="#L313">313</span>
<span id="L314" rel="#L314">314</span>
<span id="L315" rel="#L315">315</span>
<span id="L316" rel="#L316">316</span>
<span id="L317" rel="#L317">317</span>
<span id="L318" rel="#L318">318</span>
<span id="L319" rel="#L319">319</span>
<span id="L320" rel="#L320">320</span>
<span id="L321" rel="#L321">321</span>
<span id="L322" rel="#L322">322</span>
<span id="L323" rel="#L323">323</span>
<span id="L324" rel="#L324">324</span>
<span id="L325" rel="#L325">325</span>
<span id="L326" rel="#L326">326</span>
<span id="L327" rel="#L327">327</span>
<span id="L328" rel="#L328">328</span>
<span id="L329" rel="#L329">329</span>
<span id="L330" rel="#L330">330</span>
<span id="L331" rel="#L331">331</span>
<span id="L332" rel="#L332">332</span>
<span id="L333" rel="#L333">333</span>
<span id="L334" rel="#L334">334</span>
<span id="L335" rel="#L335">335</span>
<span id="L336" rel="#L336">336</span>
<span id="L337" rel="#L337">337</span>
<span id="L338" rel="#L338">338</span>
<span id="L339" rel="#L339">339</span>
<span id="L340" rel="#L340">340</span>
<span id="L341" rel="#L341">341</span>
<span id="L342" rel="#L342">342</span>
<span id="L343" rel="#L343">343</span>
<span id="L344" rel="#L344">344</span>
<span id="L345" rel="#L345">345</span>
<span id="L346" rel="#L346">346</span>
<span id="L347" rel="#L347">347</span>
<span id="L348" rel="#L348">348</span>
<span id="L349" rel="#L349">349</span>
<span id="L350" rel="#L350">350</span>
<span id="L351" rel="#L351">351</span>
<span id="L352" rel="#L352">352</span>
<span id="L353" rel="#L353">353</span>
<span id="L354" rel="#L354">354</span>
<span id="L355" rel="#L355">355</span>
<span id="L356" rel="#L356">356</span>
<span id="L357" rel="#L357">357</span>
<span id="L358" rel="#L358">358</span>
<span id="L359" rel="#L359">359</span>
<span id="L360" rel="#L360">360</span>
<span id="L361" rel="#L361">361</span>
<span id="L362" rel="#L362">362</span>
<span id="L363" rel="#L363">363</span>
<span id="L364" rel="#L364">364</span>
<span id="L365" rel="#L365">365</span>
<span id="L366" rel="#L366">366</span>
<span id="L367" rel="#L367">367</span>
<span id="L368" rel="#L368">368</span>
<span id="L369" rel="#L369">369</span>
<span id="L370" rel="#L370">370</span>
<span id="L371" rel="#L371">371</span>
<span id="L372" rel="#L372">372</span>
<span id="L373" rel="#L373">373</span>
<span id="L374" rel="#L374">374</span>
<span id="L375" rel="#L375">375</span>
<span id="L376" rel="#L376">376</span>
<span id="L377" rel="#L377">377</span>
<span id="L378" rel="#L378">378</span>
<span id="L379" rel="#L379">379</span>
<span id="L380" rel="#L380">380</span>
<span id="L381" rel="#L381">381</span>
<span id="L382" rel="#L382">382</span>
<span id="L383" rel="#L383">383</span>
<span id="L384" rel="#L384">384</span>
<span id="L385" rel="#L385">385</span>
<span id="L386" rel="#L386">386</span>
<span id="L387" rel="#L387">387</span>
<span id="L388" rel="#L388">388</span>
<span id="L389" rel="#L389">389</span>
<span id="L390" rel="#L390">390</span>
<span id="L391" rel="#L391">391</span>
<span id="L392" rel="#L392">392</span>
<span id="L393" rel="#L393">393</span>
<span id="L394" rel="#L394">394</span>
<span id="L395" rel="#L395">395</span>
<span id="L396" rel="#L396">396</span>
<span id="L397" rel="#L397">397</span>
<span id="L398" rel="#L398">398</span>
<span id="L399" rel="#L399">399</span>
<span id="L400" rel="#L400">400</span>
<span id="L401" rel="#L401">401</span>
<span id="L402" rel="#L402">402</span>
<span id="L403" rel="#L403">403</span>
<span id="L404" rel="#L404">404</span>
<span id="L405" rel="#L405">405</span>
<span id="L406" rel="#L406">406</span>
<span id="L407" rel="#L407">407</span>
<span id="L408" rel="#L408">408</span>
<span id="L409" rel="#L409">409</span>
<span id="L410" rel="#L410">410</span>
<span id="L411" rel="#L411">411</span>
<span id="L412" rel="#L412">412</span>
<span id="L413" rel="#L413">413</span>
<span id="L414" rel="#L414">414</span>
<span id="L415" rel="#L415">415</span>
<span id="L416" rel="#L416">416</span>
<span id="L417" rel="#L417">417</span>
<span id="L418" rel="#L418">418</span>
<span id="L419" rel="#L419">419</span>
<span id="L420" rel="#L420">420</span>
<span id="L421" rel="#L421">421</span>
<span id="L422" rel="#L422">422</span>
<span id="L423" rel="#L423">423</span>
<span id="L424" rel="#L424">424</span>
<span id="L425" rel="#L425">425</span>

            </td>
            <td class="blob-line-code"><div class="code-body highlight"><pre><div class='line' id='LC1'><span class="nx">angular</span><span class="p">.</span><span class="nx">module</span><span class="p">(</span><span class="s1">&#39;pascalprecht.translate&#39;</span><span class="p">)</span></div><div class='line' id='LC2'><span class="cm">/**</span></div><div class='line' id='LC3'><span class="cm"> * @ngdoc object</span></div><div class='line' id='LC4'><span class="cm"> * @name pascalprecht.translate.$translatePartialLoaderProvider</span></div><div class='line' id='LC5'><span class="cm"> *</span></div><div class='line' id='LC6'><span class="cm"> * @description</span></div><div class='line' id='LC7'><span class="cm"> * By using a $translatePartialLoaderProvider you can configure a list of a needed</span></div><div class='line' id='LC8'><span class="cm"> * translation parts directly during the configuration phase of your application&#39;s</span></div><div class='line' id='LC9'><span class="cm"> * lifetime. All parts you add by using this provider would be loaded by</span></div><div class='line' id='LC10'><span class="cm"> * angular-translate at the startup as soon as possible.</span></div><div class='line' id='LC11'><span class="cm"> */</span></div><div class='line' id='LC12'><span class="p">.</span><span class="nx">provider</span><span class="p">(</span><span class="s1">&#39;$translatePartialLoader&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC13'><br/></div><div class='line' id='LC14'>&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC15'><span class="cm">   * @constructor</span></div><div class='line' id='LC16'><span class="cm">   * @name Part</span></div><div class='line' id='LC17'><span class="cm">   *</span></div><div class='line' id='LC18'><span class="cm">   * @description</span></div><div class='line' id='LC19'><span class="cm">   * Represents Part object to add and set parts at runtime.</span></div><div class='line' id='LC20'><span class="cm">   */</span></div><div class='line' id='LC21'>&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">Part</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC22'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">name</span> <span class="o">=</span> <span class="nx">name</span><span class="p">;</span></div><div class='line' id='LC23'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">isActive</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC24'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">tables</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC25'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC26'><br/></div><div class='line' id='LC27'>&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC28'><span class="cm">   * @name parseUrl</span></div><div class='line' id='LC29'><span class="cm">   * @method</span></div><div class='line' id='LC30'><span class="cm">   *</span></div><div class='line' id='LC31'><span class="cm">   * @description</span></div><div class='line' id='LC32'><span class="cm">   * Returns a parsed url template string and replaces given target lang</span></div><div class='line' id='LC33'><span class="cm">   * and part name it.</span></div><div class='line' id='LC34'><span class="cm">   *</span></div><div class='line' id='LC35'><span class="cm">   * @param {string} urlTemplate Url pattern to use.</span></div><div class='line' id='LC36'><span class="cm">   * @param {string} targetLang Language key for language to be used.</span></div><div class='line' id='LC37'><span class="cm">   * @return {string} Parsed url template string</span></div><div class='line' id='LC38'><span class="cm">   */</span></div><div class='line' id='LC39'>&nbsp;&nbsp;<span class="nx">Part</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">parseUrl</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">urlTemplate</span><span class="p">,</span> <span class="nx">targetLang</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC40'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">urlTemplate</span><span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\{part\}/g</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">name</span><span class="p">).</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\{lang\}/g</span><span class="p">,</span> <span class="nx">targetLang</span><span class="p">);</span></div><div class='line' id='LC41'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC42'><br/></div><div class='line' id='LC43'>&nbsp;&nbsp;<span class="nx">Part</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getTable</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">lang</span><span class="p">,</span> <span class="nx">$q</span><span class="p">,</span> <span class="nx">$http</span><span class="p">,</span> <span class="nx">urlTemplate</span><span class="p">,</span> <span class="nx">errorHandler</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC44'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">deferred</span> <span class="o">=</span> <span class="nx">$q</span><span class="p">.</span><span class="nx">defer</span><span class="p">();</span></div><div class='line' id='LC45'><br/></div><div class='line' id='LC46'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">tables</span><span class="p">[</span><span class="nx">lang</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC47'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">self</span> <span class="o">=</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC48'><br/></div><div class='line' id='LC49'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$http</span><span class="p">({</span></div><div class='line' id='LC50'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">method</span> <span class="o">:</span> <span class="s1">&#39;GET&#39;</span><span class="p">,</span></div><div class='line' id='LC51'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">url</span> <span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">parseUrl</span><span class="p">(</span><span class="nx">urlTemplate</span><span class="p">,</span> <span class="nx">lang</span><span class="p">)</span></div><div class='line' id='LC52'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}).</span><span class="nx">success</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">data</span><span class="p">){</span></div><div class='line' id='LC53'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">self</span><span class="p">.</span><span class="nx">tables</span><span class="p">[</span><span class="nx">lang</span><span class="p">]</span> <span class="o">=</span> <span class="nx">data</span><span class="p">;</span></div><div class='line' id='LC54'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">resolve</span><span class="p">(</span><span class="nx">data</span><span class="p">);</span></div><div class='line' id='LC55'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}).</span><span class="nx">error</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC56'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">errorHandler</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC57'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">errorHandler</span><span class="p">(</span><span class="nx">self</span><span class="p">.</span><span class="nx">name</span><span class="p">,</span> <span class="nx">lang</span><span class="p">).</span><span class="nx">then</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC58'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">self</span><span class="p">.</span><span class="nx">tables</span><span class="p">[</span><span class="nx">lang</span><span class="p">]</span> <span class="o">=</span> <span class="nx">data</span><span class="p">;</span></div><div class='line' id='LC59'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">resolve</span><span class="p">(</span><span class="nx">data</span><span class="p">);</span></div><div class='line' id='LC60'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC61'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">reject</span><span class="p">(</span><span class="nx">self</span><span class="p">.</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC62'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">});</span></div><div class='line' id='LC63'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC64'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">reject</span><span class="p">(</span><span class="nx">self</span><span class="p">.</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC65'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC66'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">});</span></div><div class='line' id='LC67'><br/></div><div class='line' id='LC68'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC69'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">resolve</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">tables</span><span class="p">[</span><span class="nx">lang</span><span class="p">]);</span></div><div class='line' id='LC70'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC71'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">deferred</span><span class="p">.</span><span class="nx">promise</span><span class="p">;</span></div><div class='line' id='LC72'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC73'><br/></div><div class='line' id='LC74'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">parts</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC75'><br/></div><div class='line' id='LC76'>&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">hasPart</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC77'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">parts</span><span class="p">.</span><span class="nx">hasOwnProperty</span><span class="p">(</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC78'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC79'><br/></div><div class='line' id='LC80'>&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">isStringValid</span><span class="p">(</span><span class="nx">str</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC81'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">angular</span><span class="p">.</span><span class="nx">isString</span><span class="p">(</span><span class="nx">str</span><span class="p">)</span> <span class="o">&amp;&amp;</span> <span class="nx">str</span> <span class="o">!==</span> <span class="s1">&#39;&#39;</span><span class="p">;</span></div><div class='line' id='LC82'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC83'><br/></div><div class='line' id='LC84'>&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">isPartAvailable</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC85'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC86'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Invalid type of a first argument, a non-empty string expected.&#39;</span><span class="p">);</span></div><div class='line' id='LC87'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC88'><br/></div><div class='line' id='LC89'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="p">(</span><span class="nx">hasPart</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="o">&amp;&amp;</span> <span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">].</span><span class="nx">isActive</span><span class="p">);</span></div><div class='line' id='LC90'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC91'><br/></div><div class='line' id='LC92'>&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">deepExtend</span><span class="p">(</span><span class="nx">dst</span><span class="p">,</span> <span class="nx">src</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC93'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">property</span> <span class="k">in</span> <span class="nx">src</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC94'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">src</span><span class="p">[</span><span class="nx">property</span><span class="p">]</span> <span class="o">&amp;&amp;</span> <span class="nx">src</span><span class="p">[</span><span class="nx">property</span><span class="p">].</span><span class="nx">constructor</span> <span class="o">&amp;&amp;</span></div><div class='line' id='LC95'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">src</span><span class="p">[</span><span class="nx">property</span><span class="p">].</span><span class="nx">constructor</span> <span class="o">===</span> <span class="nb">Object</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC96'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">dst</span><span class="p">[</span><span class="nx">property</span><span class="p">]</span> <span class="o">=</span> <span class="nx">dst</span><span class="p">[</span><span class="nx">property</span><span class="p">]</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC97'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">arguments</span><span class="p">.</span><span class="nx">callee</span><span class="p">(</span><span class="nx">dst</span><span class="p">[</span><span class="nx">property</span><span class="p">],</span> <span class="nx">src</span><span class="p">[</span><span class="nx">property</span><span class="p">]);</span></div><div class='line' id='LC98'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC99'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">dst</span><span class="p">[</span><span class="nx">property</span><span class="p">]</span> <span class="o">=</span> <span class="nx">src</span><span class="p">[</span><span class="nx">property</span><span class="p">];</span></div><div class='line' id='LC100'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC101'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC102'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">dst</span><span class="p">;</span></div><div class='line' id='LC103'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC104'><br/></div><div class='line' id='LC105'><br/></div><div class='line' id='LC106'>&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC107'><span class="cm">   * @ngdoc function</span></div><div class='line' id='LC108'><span class="cm">   * @name pascalprecht.translate.$translatePartialLoaderProvider#addPart</span></div><div class='line' id='LC109'><span class="cm">   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider</span></div><div class='line' id='LC110'><span class="cm">   *</span></div><div class='line' id='LC111'><span class="cm">   * @description</span></div><div class='line' id='LC112'><span class="cm">   * Registers a new part of the translation table to be loaded once the</span></div><div class='line' id='LC113'><span class="cm">   * `angular-translate` gets into runtime phase. It does not actually load any</span></div><div class='line' id='LC114'><span class="cm">   * translation data, but only registers a part to be loaded in the future.</span></div><div class='line' id='LC115'><span class="cm">   *</span></div><div class='line' id='LC116'><span class="cm">   * @param {string} name A name of the part to add</span></div><div class='line' id='LC117'><span class="cm">   * @returns {object} $translatePartialLoaderProvider, so this method is chainable</span></div><div class='line' id='LC118'><span class="cm">   * @throws {TypeError} The method could throw a **TypeError** if you pass the param</span></div><div class='line' id='LC119'><span class="cm">   * of the wrong type. Please, note that the `name` param has to be a</span></div><div class='line' id='LC120'><span class="cm">   * non-empty **string**.</span></div><div class='line' id='LC121'><span class="cm">   */</span></div><div class='line' id='LC122'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">addPart</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC123'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC124'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Couldn\&#39;t add part, part name has to be a string!&#39;</span><span class="p">);</span></div><div class='line' id='LC125'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC126'><br/></div><div class='line' id='LC127'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">hasPart</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC128'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Part</span><span class="p">(</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC129'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC130'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">].</span><span class="nx">isActive</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC131'><br/></div><div class='line' id='LC132'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC133'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC134'><br/></div><div class='line' id='LC135'>&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC136'><span class="cm">   * @ngdocs function</span></div><div class='line' id='LC137'><span class="cm">   * @name pascalprecht.translate.$translatePartialLoaderProvider#setPart</span></div><div class='line' id='LC138'><span class="cm">   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider</span></div><div class='line' id='LC139'><span class="cm">   *</span></div><div class='line' id='LC140'><span class="cm">   * @description</span></div><div class='line' id='LC141'><span class="cm">   * Sets a translation table to the specified part. This method does not make the</span></div><div class='line' id='LC142'><span class="cm">   * specified part available, but only avoids loading this part from the server.</span></div><div class='line' id='LC143'><span class="cm">   *</span></div><div class='line' id='LC144'><span class="cm">   * @param {string} lang A language of the given translation table</span></div><div class='line' id='LC145'><span class="cm">   * @param {string} part A name of the target part</span></div><div class='line' id='LC146'><span class="cm">   * @param {object} table A translation table to set to the specified part</span></div><div class='line' id='LC147'><span class="cm">   *</span></div><div class='line' id='LC148'><span class="cm">   * @return {object} $translatePartialLoaderProvider, so this method is chainable</span></div><div class='line' id='LC149'><span class="cm">   * @throws {TypeError} The method could throw a **TypeError** if you pass params</span></div><div class='line' id='LC150'><span class="cm">   * of the wrong type. Please, note that the `lang` and `part` params have to be a</span></div><div class='line' id='LC151'><span class="cm">   * non-empty **string**s and the `table` param has to be an object.</span></div><div class='line' id='LC152'><span class="cm">   */</span></div><div class='line' id='LC153'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">setPart</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">lang</span><span class="p">,</span> <span class="nx">part</span><span class="p">,</span> <span class="nx">table</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC154'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">lang</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC155'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Couldn\&#39;t set part.`lang` parameter has to be a string!&#39;</span><span class="p">);</span></div><div class='line' id='LC156'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC157'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">part</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC158'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Couldn\&#39;t set part.`part` parameter has to be a string!&#39;</span><span class="p">);</span></div><div class='line' id='LC159'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC160'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">table</span> <span class="o">!==</span> <span class="s1">&#39;object&#39;</span> <span class="o">||</span> <span class="nx">table</span> <span class="o">===</span> <span class="kc">null</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC161'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Couldn\&#39;t set part. `table` parameter has to be an object!&#39;</span><span class="p">);</span></div><div class='line' id='LC162'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC163'><br/></div><div class='line' id='LC164'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">hasPart</span><span class="p">(</span><span class="nx">part</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC165'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">part</span><span class="p">]</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Part</span><span class="p">(</span><span class="nx">part</span><span class="p">);</span></div><div class='line' id='LC166'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">part</span><span class="p">].</span><span class="nx">isActive</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC167'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC168'><br/></div><div class='line' id='LC169'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">part</span><span class="p">].</span><span class="nx">tables</span><span class="p">[</span><span class="nx">lang</span><span class="p">]</span> <span class="o">=</span> <span class="nx">table</span><span class="p">;</span></div><div class='line' id='LC170'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC171'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC172'><br/></div><div class='line' id='LC173'>&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC174'><span class="cm">   * @ngdoc function</span></div><div class='line' id='LC175'><span class="cm">   * @name pascalprecht.translate.$translatePartialLoaderProvider#deletePart</span></div><div class='line' id='LC176'><span class="cm">   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider</span></div><div class='line' id='LC177'><span class="cm">   *</span></div><div class='line' id='LC178'><span class="cm">   * @description</span></div><div class='line' id='LC179'><span class="cm">   * Removes the previously added part of the translation data. So, `angular-translate` will not</span></div><div class='line' id='LC180'><span class="cm">   * load it at the startup.</span></div><div class='line' id='LC181'><span class="cm">   *</span></div><div class='line' id='LC182'><span class="cm">   * @param {string} name A name of the part to delete</span></div><div class='line' id='LC183'><span class="cm">   *</span></div><div class='line' id='LC184'><span class="cm">   * @returns {object} $translatePartialLoaderProvider, so this method is chainable</span></div><div class='line' id='LC185'><span class="cm">   *</span></div><div class='line' id='LC186'><span class="cm">   * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong</span></div><div class='line' id='LC187'><span class="cm">   * type. Please, note that the `name` param has to be a non-empty **string**.</span></div><div class='line' id='LC188'><span class="cm">   */</span></div><div class='line' id='LC189'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">deletePart</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC190'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC191'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Couldn\&#39;t delete part, first arg has to be string.&#39;</span><span class="p">);</span></div><div class='line' id='LC192'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC193'><br/></div><div class='line' id='LC194'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">hasPart</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC195'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">].</span><span class="nx">isActive</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC196'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC197'><br/></div><div class='line' id='LC198'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC199'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC200'><br/></div><div class='line' id='LC201'><br/></div><div class='line' id='LC202'>&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC203'><span class="cm">   * @ngdoc function</span></div><div class='line' id='LC204'><span class="cm">   * @name pascalprecht.translate.$translatePartialLoaderProvider#isPartAvailable</span></div><div class='line' id='LC205'><span class="cm">   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider</span></div><div class='line' id='LC206'><span class="cm">   *</span></div><div class='line' id='LC207'><span class="cm">   * @description</span></div><div class='line' id='LC208'><span class="cm">   * Checks if the specific part is available. A part becomes available after it was added by the</span></div><div class='line' id='LC209'><span class="cm">   * `addPart` method. Available parts would be loaded from the server once the `angular-translate`</span></div><div class='line' id='LC210'><span class="cm">   * asks the loader to that.</span></div><div class='line' id='LC211'><span class="cm">   *</span></div><div class='line' id='LC212'><span class="cm">   * @param {string} name A name of the part to check</span></div><div class='line' id='LC213'><span class="cm">   *</span></div><div class='line' id='LC214'><span class="cm">   * @returns {boolean} Returns **true** if the part is available now and **false** if not.</span></div><div class='line' id='LC215'><span class="cm">   *</span></div><div class='line' id='LC216'><span class="cm">   * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong</span></div><div class='line' id='LC217'><span class="cm">   * type. Please, note that the `name` param has to be a non-empty **string**.</span></div><div class='line' id='LC218'><span class="cm">   */</span></div><div class='line' id='LC219'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">isPartAvailable</span> <span class="o">=</span> <span class="nx">isPartAvailable</span><span class="p">;</span></div><div class='line' id='LC220'><br/></div><div class='line' id='LC221'>&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC222'><span class="cm">   * @ngdoc object</span></div><div class='line' id='LC223'><span class="cm">   * @name pascalprecht.translate.$translatePartialLoader</span></div><div class='line' id='LC224'><span class="cm">   *</span></div><div class='line' id='LC225'><span class="cm">   * @requires $q</span></div><div class='line' id='LC226'><span class="cm">   * @requires $http</span></div><div class='line' id='LC227'><span class="cm">   * @requires $injector</span></div><div class='line' id='LC228'><span class="cm">   * @requires $rootScope</span></div><div class='line' id='LC229'><span class="cm">   *</span></div><div class='line' id='LC230'><span class="cm">   * @description</span></div><div class='line' id='LC231'><span class="cm">   *</span></div><div class='line' id='LC232'><span class="cm">   * @param {object} options Options object</span></div><div class='line' id='LC233'><span class="cm">   *</span></div><div class='line' id='LC234'><span class="cm">   * @throws {TypeError}</span></div><div class='line' id='LC235'><span class="cm">   */</span></div><div class='line' id='LC236'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$get</span> <span class="o">=</span> <span class="p">[</span><span class="s1">&#39;$rootScope&#39;</span><span class="p">,</span> <span class="s1">&#39;$injector&#39;</span><span class="p">,</span> <span class="s1">&#39;$q&#39;</span><span class="p">,</span> <span class="s1">&#39;$http&#39;</span><span class="p">,</span></div><div class='line' id='LC237'>&nbsp;&nbsp;<span class="kd">function</span><span class="p">(</span><span class="nx">$rootScope</span><span class="p">,</span> <span class="nx">$injector</span><span class="p">,</span> <span class="nx">$q</span><span class="p">,</span> <span class="nx">$http</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC238'><br/></div><div class='line' id='LC239'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC240'><span class="cm">     * @ngdoc event</span></div><div class='line' id='LC241'><span class="cm">     * @name pascalprecht.translate.$translatePartialLoader#$translatePartialLoaderStructureChanged</span></div><div class='line' id='LC242'><span class="cm">     * @eventOf pascalprecht.translate.$translatePartialLoader</span></div><div class='line' id='LC243'><span class="cm">     * @eventType broadcast on root scope</span></div><div class='line' id='LC244'><span class="cm">     *</span></div><div class='line' id='LC245'><span class="cm">     * @description</span></div><div class='line' id='LC246'><span class="cm">     * A $translatePartialLoaderStructureChanged event is called when a state of the loader was</span></div><div class='line' id='LC247'><span class="cm">     * changed somehow. It could mean either some part is added or some part is deleted. Anyway when</span></div><div class='line' id='LC248'><span class="cm">     * you get this event the translation table is not longer current and has to be updated.</span></div><div class='line' id='LC249'><span class="cm">     *</span></div><div class='line' id='LC250'><span class="cm">     * @param {string} name A name of the part which is a reason why the event was fired</span></div><div class='line' id='LC251'><span class="cm">     */</span></div><div class='line' id='LC252'><br/></div><div class='line' id='LC253'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">service</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC254'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">key</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC255'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Unable to load data, a key is not a non-empty string.&#39;</span><span class="p">);</span></div><div class='line' id='LC256'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC257'><br/></div><div class='line' id='LC258'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">urlTemplate</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC259'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Unable to load data, a urlTemplate is not a non-empty string.&#39;</span><span class="p">);</span></div><div class='line' id='LC260'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC261'><br/></div><div class='line' id='LC262'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">errorHandler</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">loadFailureHandler</span><span class="p">;</span></div><div class='line' id='LC263'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">errorHandler</span> <span class="o">!==</span> <span class="kc">undefined</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC264'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">angular</span><span class="p">.</span><span class="nx">isString</span><span class="p">(</span><span class="nx">errorHandler</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC265'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">(</span><span class="s1">&#39;Unable to load data, a loadFailureHandler is not a string.&#39;</span><span class="p">);</span></div><div class='line' id='LC266'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="nx">errorHandler</span> <span class="o">=</span> <span class="nx">$injector</span><span class="p">.</span><span class="nx">get</span><span class="p">(</span><span class="nx">errorHandler</span><span class="p">);</span></div><div class='line' id='LC267'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC268'><br/></div><div class='line' id='LC269'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">loaders</span> <span class="o">=</span> <span class="p">[],</span></div><div class='line' id='LC270'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tables</span> <span class="o">=</span> <span class="p">[],</span></div><div class='line' id='LC271'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span> <span class="o">=</span> <span class="nx">$q</span><span class="p">.</span><span class="nx">defer</span><span class="p">();</span></div><div class='line' id='LC272'><br/></div><div class='line' id='LC273'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">addTablePart</span><span class="p">(</span><span class="nx">table</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC274'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tables</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">table</span><span class="p">);</span></div><div class='line' id='LC275'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC276'><br/></div><div class='line' id='LC277'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">part</span> <span class="k">in</span> <span class="nx">parts</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC278'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">hasPart</span><span class="p">(</span><span class="nx">part</span><span class="p">)</span> <span class="o">&amp;&amp;</span> <span class="nx">parts</span><span class="p">[</span><span class="nx">part</span><span class="p">].</span><span class="nx">isActive</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC279'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">loaders</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span></div><div class='line' id='LC280'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">part</span><span class="p">]</span></div><div class='line' id='LC281'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">getTable</span><span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">key</span><span class="p">,</span> <span class="nx">$q</span><span class="p">,</span> <span class="nx">$http</span><span class="p">,</span> <span class="nx">options</span><span class="p">.</span><span class="nx">urlTemplate</span><span class="p">,</span> <span class="nx">errorHandler</span><span class="p">)</span></div><div class='line' id='LC282'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">then</span><span class="p">(</span><span class="nx">addTablePart</span><span class="p">)</span></div><div class='line' id='LC283'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">);</span></div><div class='line' id='LC284'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC285'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC286'><br/></div><div class='line' id='LC287'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">loaders</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC288'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$q</span><span class="p">.</span><span class="nx">all</span><span class="p">(</span><span class="nx">loaders</span><span class="p">).</span><span class="nx">then</span><span class="p">(</span></div><div class='line' id='LC289'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC290'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">table</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC291'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">tables</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC292'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deepExtend</span><span class="p">(</span><span class="nx">table</span><span class="p">,</span> <span class="nx">tables</span><span class="p">[</span><span class="nx">i</span><span class="p">]);</span></div><div class='line' id='LC293'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC294'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">resolve</span><span class="p">(</span><span class="nx">table</span><span class="p">);</span></div><div class='line' id='LC295'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC296'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC297'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">reject</span><span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">key</span><span class="p">);</span></div><div class='line' id='LC298'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC299'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">);</span></div><div class='line' id='LC300'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC301'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">deferred</span><span class="p">.</span><span class="nx">resolve</span><span class="p">({});</span></div><div class='line' id='LC302'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC303'><br/></div><div class='line' id='LC304'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">deferred</span><span class="p">.</span><span class="nx">promise</span><span class="p">;</span></div><div class='line' id='LC305'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC306'><br/></div><div class='line' id='LC307'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC308'><span class="cm">     * @ngdoc function</span></div><div class='line' id='LC309'><span class="cm">     * @name pascalprecht.translate.$translatePartialLoader#addPart</span></div><div class='line' id='LC310'><span class="cm">     * @methodOf pascalprecht.translate.$translatePartialLoader</span></div><div class='line' id='LC311'><span class="cm">     *</span></div><div class='line' id='LC312'><span class="cm">     * @description</span></div><div class='line' id='LC313'><span class="cm">     * Registers a new part of the translation table. This method does actually not perform any xhr</span></div><div class='line' id='LC314'><span class="cm">     * requests to get a translation data. The new parts would be loaded from the server next time</span></div><div class='line' id='LC315'><span class="cm">     * `angular-translate` asks to loader to loaded translations.</span></div><div class='line' id='LC316'><span class="cm">     *</span></div><div class='line' id='LC317'><span class="cm">     * @param {string} name A name of the part to add</span></div><div class='line' id='LC318'><span class="cm">     *</span></div><div class='line' id='LC319'><span class="cm">     * @returns {object} $translatePartialLoader, so this method is chainable</span></div><div class='line' id='LC320'><span class="cm">     *</span></div><div class='line' id='LC321'><span class="cm">     * @fires {$translatePartialLoaderStructureChanged} The $translatePartialLoaderStructureChanged</span></div><div class='line' id='LC322'><span class="cm">     * event would be fired by this method in case the new part affected somehow on the loaders</span></div><div class='line' id='LC323'><span class="cm">     * state. This way it means that there are a new translation data available to be loaded from</span></div><div class='line' id='LC324'><span class="cm">     * the server.</span></div><div class='line' id='LC325'><span class="cm">     *</span></div><div class='line' id='LC326'><span class="cm">     * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong</span></div><div class='line' id='LC327'><span class="cm">     * type. Please, note that the `name` param has to be a non-empty **string**.</span></div><div class='line' id='LC328'><span class="cm">     */</span></div><div class='line' id='LC329'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">service</span><span class="p">.</span><span class="nx">addPart</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC330'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC331'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Couldn\&#39;t add part, first arg has to be a string&#39;</span><span class="p">);</span></div><div class='line' id='LC332'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC333'><br/></div><div class='line' id='LC334'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">hasPart</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC335'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Part</span><span class="p">(</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC336'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$rootScope</span><span class="p">.</span><span class="nx">$emit</span><span class="p">(</span><span class="s1">&#39;$translatePartialLoaderStructureChanged&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC337'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">].</span><span class="nx">isActive</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC338'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">].</span><span class="nx">isActive</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC339'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$rootScope</span><span class="p">.</span><span class="nx">$emit</span><span class="p">(</span><span class="s1">&#39;$translatePartialLoaderStructureChanged&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC340'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC341'><br/></div><div class='line' id='LC342'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">service</span><span class="p">;</span></div><div class='line' id='LC343'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC344'><br/></div><div class='line' id='LC345'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC346'><span class="cm">     * @ngdoc function</span></div><div class='line' id='LC347'><span class="cm">     * @name pascalprecht.translate.$translatePartialLoader#deletePart</span></div><div class='line' id='LC348'><span class="cm">     * @methodOf pascalprecht.translate.$translatePartialLoader</span></div><div class='line' id='LC349'><span class="cm">     *</span></div><div class='line' id='LC350'><span class="cm">     * @description</span></div><div class='line' id='LC351'><span class="cm">     * Deletes the previously added part of the translation data. The target part could be deleted</span></div><div class='line' id='LC352'><span class="cm">     * either logically or physically. When the data is deleted logically it is not actually deleted</span></div><div class='line' id='LC353'><span class="cm">     * from the browser, but the loader marks it as not active and prevents it from affecting on the</span></div><div class='line' id='LC354'><span class="cm">     * translations. If the deleted in such way part is added again, the loader will use the</span></div><div class='line' id='LC355'><span class="cm">     * previously loaded data rather than loading it from the server once more time. But if the data</span></div><div class='line' id='LC356'><span class="cm">     * is deleted physically, the loader will completely remove all information about it. So in case</span></div><div class='line' id='LC357'><span class="cm">     * of recycling this part will be loaded from the server again.</span></div><div class='line' id='LC358'><span class="cm">     *</span></div><div class='line' id='LC359'><span class="cm">     * @param {string} name A name of the part to delete</span></div><div class='line' id='LC360'><span class="cm">     * @param {boolean=} [removeData=false] An indicator if the loader has to remove a loaded</span></div><div class='line' id='LC361'><span class="cm">     * translation data physically. If the `removeData` if set to **false** the loaded data will not be</span></div><div class='line' id='LC362'><span class="cm">     * deleted physically and might be reused in the future to prevent an additional xhr requests.</span></div><div class='line' id='LC363'><span class="cm">     *</span></div><div class='line' id='LC364'><span class="cm">     * @returns {object} $translatePartialLoader, so this method is chainable</span></div><div class='line' id='LC365'><span class="cm">     *</span></div><div class='line' id='LC366'><span class="cm">     * @fires {$translatePartialLoaderStructureChanged} The $translatePartialLoaderStructureChanged</span></div><div class='line' id='LC367'><span class="cm">     * event would be fired by this method in case a part deletion process affects somehow on the</span></div><div class='line' id='LC368'><span class="cm">     * loaders state. This way it means that some part of the translation data is now deprecated and</span></div><div class='line' id='LC369'><span class="cm">     * the translation table has to be recompiled with the remaining translation parts.</span></div><div class='line' id='LC370'><span class="cm">     *</span></div><div class='line' id='LC371'><span class="cm">     * @throws {TypeError} The method could throw a **TypeError** if you pass some param of the</span></div><div class='line' id='LC372'><span class="cm">     * wrong type. Please, note that the `name` param has to be a non-empty **string** and</span></div><div class='line' id='LC373'><span class="cm">     * the `removeData` param has to be either **undefined** or **boolean**.</span></div><div class='line' id='LC374'><span class="cm">     */</span></div><div class='line' id='LC375'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">service</span><span class="p">.</span><span class="nx">deletePart</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">,</span> <span class="nx">removeData</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC376'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">isStringValid</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC377'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Couldn\&#39;t delete part, first arg has to be string&#39;</span><span class="p">);</span></div><div class='line' id='LC378'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC379'><br/></div><div class='line' id='LC380'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">removeData</span> <span class="o">===</span> <span class="kc">undefined</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC381'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">removeData</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC382'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">removeData</span> <span class="o">!==</span> <span class="s1">&#39;boolean&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC383'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s1">&#39;Invalid type of a second argument, a boolean expected.&#39;</span><span class="p">);</span></div><div class='line' id='LC384'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC385'><br/></div><div class='line' id='LC386'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">hasPart</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC387'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">wasActive</span> <span class="o">=</span> <span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">].</span><span class="nx">isActive</span><span class="p">;</span></div><div class='line' id='LC388'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">removeData</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC389'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">delete</span> <span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">];</span></div><div class='line' id='LC390'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC391'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">parts</span><span class="p">[</span><span class="nx">name</span><span class="p">].</span><span class="nx">isActive</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC392'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC393'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">wasActive</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC394'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$rootScope</span><span class="p">.</span><span class="nx">$emit</span><span class="p">(</span><span class="s1">&#39;$translatePartialLoaderStructureChanged&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC395'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC396'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC397'><br/></div><div class='line' id='LC398'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">service</span><span class="p">;</span></div><div class='line' id='LC399'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC400'><br/></div><div class='line' id='LC401'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">/**</span></div><div class='line' id='LC402'><span class="cm">     * @ngdoc function</span></div><div class='line' id='LC403'><span class="cm">     * @name pascalprecht.translate.$translatePartialLoader#isPartAvailable</span></div><div class='line' id='LC404'><span class="cm">     * @methodOf pascalprecht.translate.$translatePartialLoader</span></div><div class='line' id='LC405'><span class="cm">     *</span></div><div class='line' id='LC406'><span class="cm">     * @description</span></div><div class='line' id='LC407'><span class="cm">     * Checks if a target translation part is available. The part becomes available just after it was</span></div><div class='line' id='LC408'><span class="cm">     * added by the `addPart` method. Part&#39;s availability does not mean that it was loaded from the</span></div><div class='line' id='LC409'><span class="cm">     * server, but only that it was added to the loader. The available part might be loaded next</span></div><div class='line' id='LC410'><span class="cm">     * time the loader is called.</span></div><div class='line' id='LC411'><span class="cm">     *</span></div><div class='line' id='LC412'><span class="cm">     * @param {string} name A name of the part to delete</span></div><div class='line' id='LC413'><span class="cm">     *</span></div><div class='line' id='LC414'><span class="cm">     * @returns {boolean} Returns **true** if the part is available now and **false** if not.</span></div><div class='line' id='LC415'><span class="cm">     *</span></div><div class='line' id='LC416'><span class="cm">     * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong</span></div><div class='line' id='LC417'><span class="cm">     * type. Please, note that the `name` param has to be a non-empty **string**.</span></div><div class='line' id='LC418'><span class="cm">     */</span></div><div class='line' id='LC419'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">service</span><span class="p">.</span><span class="nx">isPartAvailable</span> <span class="o">=</span> <span class="nx">isPartAvailable</span><span class="p">;</span></div><div class='line' id='LC420'><br/></div><div class='line' id='LC421'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">service</span><span class="p">;</span></div><div class='line' id='LC422'><br/></div><div class='line' id='LC423'>&nbsp;&nbsp;<span class="p">}];</span></div><div class='line' id='LC424'><br/></div><div class='line' id='LC425'><span class="p">});</span></div></pre></div></td>
          </tr>
        </table>
  </div>

  </div>
</div>

<a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" class="js-jump-to-line" style="display:none">Jump to Line</a>
<div id="jump-to-line" style="display:none">
  <form accept-charset="UTF-8" class="js-jump-to-line-form">
    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" autofocus>
    <button type="submit" class="button">Go</button>
  </form>
</div>

        </div>

      </div><!-- /.repo-container -->
      <div class="modal-backdrop"></div>
    </div><!-- /.container -->
  </div><!-- /.site -->


    </div><!-- /.wrapper -->

      <div class="container">
  <div class="site-footer">
    <ul class="site-footer-links right">
      <li><a href="https://status.github.com/">Status</a></li>
      <li><a href="http://developer.github.com">API</a></li>
      <li><a href="http://training.github.com">Training</a></li>
      <li><a href="http://shop.github.com">Shop</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/about">About</a></li>

    </ul>

    <a href="/">
      <span class="mega-octicon octicon-mark-github" title="GitHub"></span>
    </a>

    <ul class="site-footer-links">
      <li>&copy; 2014 <span title="0.03212s from github-fe137-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="/site/terms">Terms</a></li>
        <li><a href="/site/privacy">Privacy</a></li>
        <li><a href="/security">Security</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
  </div><!-- /.site-footer -->
</div><!-- /.container -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-fullscreen-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="js-fullscreen-contents" placeholder="" data-suggester="fullscreen_suggester"></textarea>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped tooltipped-w" aria-label="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped tooltipped-w"
      aria-label="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <a href="#" class="octicon octicon-remove-close close js-ajax-error-dismiss"></a>
      Something went wrong with that request. Please try again.
    </div>

  </body>
</html>

