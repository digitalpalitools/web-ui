param (
  $SrcDir = (Join-Path $PSScriptRoot "../../cst")
)

$rootId = "__root__"

function ConvertTo-TipitakaHierarchy {
  param(
    $SrcRoot,
    $ParentId,
    [Parameter(ValueFromPipeline = $true)]
    [Xml.XmlNode]
    $Node
  )

  Process {
    [PSCustomObject] $entry = @{
      parent = $ParentId
      name = if ($Node.text) { $Node.text } else { $rootId }
    }

    $entry.id = $entry.name

    $childEntries = @()

    if ($Node.src) {
      $entry.id = $Node.src
      $childHierarchyFile = Join-Path $SrcDir $Node.src
      $childHierarchyNode = [xml](Get-Content $childHierarchyFile)
      [array] $childEntries =
        $childHierarchyNode.tree.ChildNodes
        | Where-Object { $_.Name -ne "#comment" }
        | ConvertTo-TipitakaHierarchy $SrcRoot $entry.id
    } elseif ($Node.action) {
      $entry.id = $Node.action
    } elseif ($Node.tree -is [array]) {
      [array] $childEntries =
        $Node.tree
        | ConvertTo-TipitakaHierarchy $SrcRoot $entry.id
    } elseif ($Node.tree -isnot [array]) {
      [array] $childEntries =
        $Node.tree.tree
        | ConvertTo-TipitakaHierarchy $SrcRoot $entry.id
    } else {
      throw "Unknown node type: $($Node.Name)"
    }

    @($entry) + $childEntries
  }
}

function NormalizeId {
  param(
    [Parameter(ValueFromPipeline = $true)]
    $Id
  )

  $newId = ($Id -ireplace "^(\.\/)?(cscd\/)").ToLowerInvariant()

  if ($newId -imatch "^toc(\d)*\.xml") {
    $newId = "../$newId"
  }

  $newId
}

$tocFile = Join-Path $SrcDir "tipitaka_toc.xml"
Write-Host "Generating Hierarchy with $tocFile"
[xml] $toc = Get-Content $tocFile

$entries = $toc | ConvertTo-TipitakaHierarchy $SrcRoot "tipitaka_toc.xml"
$entries = $entries | ForEach-Object {
  $_.id = $_.id | NormalizeId
  $_.parent = $_.parent | NormalizeId

  if ($_.parent -eq "?") {
    $_.parent = $rootId
  }

  $_
}

$outFile = Join-Path $PSScriptRoot "..\src\pages\WordFrequency\services\TipitakaHierarchyService\tipitakahierarchy.json"
$entries | ConvertTo-Json -Depth 15 >$outFile

# Self tests
#
$expectedNodeCount = 2955
Write-Host "... Check that expected count is $expectedNodeCount " -NoNewline
if ($entries.Length -eq $expectedNodeCount) {
  Write-Host -ForegroundColor Green "[PASS]"
} else {
  Write-Host -ForegroundColor Red "[FAIL: Actual count is $($entries.Count)]"
}

Write-Host "... Check that ids are unique " -NoNewline
$groups = $entries | Group-Object -Property id
if ($entries.Length -eq $groups.Count) {
  Write-Host -ForegroundColor Green "[PASS]"
} else {
  Write-Host -ForegroundColor Red "[FAIL: One or more ids not unque! ($($entries.Count) vs $($groups.Count))]"
}

Write-Host "... Check that just 1 ID with $rootId " -NoNewline
$roots = $entries | Where-Object { $_.id -eq $rootId }
if ($roots.Length -eq 1) {
  Write-Host -ForegroundColor Green "[PASS]"
} else {
  Write-Host -ForegroundColor Red "[FAIL: More than 1 $root! ($($roots.Length))]"
}
