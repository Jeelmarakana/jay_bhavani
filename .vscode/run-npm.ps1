param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('build', 'dev', 'start')]
  [string]$Script
)

$npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
$npmPath = if ($npmCommand) { $npmCommand.Source } else { $null }

if (-not $npmPath) {
  $roots = @($env:NVM_SYMLINK, $env:NVM_HOME)
  if ($env:APPDATA) {
    $roots += Join-Path $env:APPDATA 'nvm'
  }
  if ($env:ProgramFiles) {
    $roots += Join-Path $env:ProgramFiles 'nodejs'
  }

  foreach ($root in $roots | Where-Object { $_ -and (Test-Path $_) }) {
    $candidate = Join-Path $root 'npm.cmd'
    if (Test-Path $candidate) {
      $npmPath = $candidate
      break
    }

    $versionDirectories = Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -match '^v?\d+(\.\d+){1,3}$' } |
      Sort-Object { [version]$_.Name.TrimStart('v') } -Descending

    foreach ($versionDirectory in $versionDirectories) {
      $candidate = Join-Path $versionDirectory.FullName 'npm.cmd'
      if (Test-Path $candidate) {
        $npmPath = $candidate
        break
      }
    }
    if ($npmPath) {
      break
    }
  }
}

if (-not $npmPath) {
  throw 'Node.js/npm was not found. Install Node.js or add npm to PATH.'
}

$env:PATH = "$(Split-Path $npmPath);$env:WINDIR\System32;$env:WINDIR;$env:PATH"
$env:NG_CLI_ANALYTICS = 'false'
& $npmPath run $Script
exit $LASTEXITCODE
