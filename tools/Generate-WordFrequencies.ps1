param (
  $EntriesFile = (Join-Path $PSScriptRoot "../src/pages/WordFrequency/services/TipitakaHierarchyService/tipitakahierarchy.json"),
  $SrcRoot = (Join-Path $PSScriptRoot "../../wf/cscd")
)

$rootId = "__root__"

function GetChildNodes {
  param(
    $Entries,
    [Parameter(ValueFromPipeline = $true)]
    $Entry
  )

  $Entries | Where-Object { $_.parent -ieq $Entry.id }
}

function Write-WordFrequency {
  param(
    $SrcRoot,
    [Parameter(ValueFromPipeline = $true)]
    $Id
  )

  $inclusionsPath = Join-Path $SrcRoot "$Id.included.txt"
  $wfPath = Join-Path $SrcRoot "$Id.wf.csv"
  Write-Host "... ... Measuring word frequency in $inclusionsPath" -ForegroundColor DarkMagenta
  $allText = Get-Content $inclusionsPath -Raw
  $allTextNoWS = $allText -replace "\s\s+", " "
  $groups = $allTextNoWS.Trim().Split(" ") | Group-Object
  $wf = 
    $groups
    | Sort-Object -Property Count -Descending
    | Select-Object -Property Count, Name
    | ForEach-Object { "{0},{1}" -f $_.Name,$_.Count }
  $wf | Out-File -FilePath $wfPath
  Write-Host "... ... Generated word frequency at $wfPath" -ForegroundColor DarkMagenta
}

function Measure-WordFrequencyForNode {
  param(
    $SrcRoot,
    $Entries,
    [Parameter(ValueFromPipeline = $true)]
    $Entry
  )

  [array] $childNodes = $Entry | GetChildNodes $Entries
  Write-Host "Start processing $($Entry.id)" -ForegroundColor White

  if ($childNodes.Length) {
    Write-Host "... Is a container. Start processing $($childNodes.Length) children."
    $childNodes
    | ForEach-Object {
      $_ | Measure-WordFrequencyForNode $SrcRoot $Entries
    }
    Write-Host "... Done processing children." -ForegroundColor Green
  } else {
    Write-Host "... Is a leaf. Processing directly."
    Write-WordFrequency $SrcRoot $Entry.id
    Write-Host "... Done processing." -ForegroundColor Green
  }
}

$entries = Get-Content $EntriesFile | ConvertFrom-Json

$entries
| Where-Object { $_.id -eq $rootId }
| Measure-WordFrequencyForNode $SrcRoot $entries
