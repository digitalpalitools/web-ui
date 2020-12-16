param (
  $SrcDir = (Join-Path $PSScriptRoot "../../cst")
)

function ConvertTo-TipitakaHierarchy {
  param(
    $SrcRoot,
    [Parameter(ValueFromPipeline = $true)]
    [Xml.XmlNode]
    $Node
  )

  Process {
    $hierarchy = @{
      name = if ($Node.text) { $Node.text } else { "?" }
      id = $Node.text
    }

    $nodeType = "folder"
    if ($Node.src) {
      $hierarchy.id = $Node.src
      $childHierarchyFile = Join-Path $SrcDir $Node.src
      $childHierarchyNode = [xml](Get-Content $childHierarchyFile)
      [array] $hierarchy.children =
        $childHierarchyNode.tree.ChildNodes
        | Where-Object { $_.Name -ne "#comment" }
        | ConvertTo-TipitakaHierarchy $SrcRoot
    } elseif ($Node.action) {
      $hierarchy.id = $Node.action
      $hierarchy.source = $Node.action
      $nodeType = "leaf"
    } elseif ($Node.tree -is [array]) {
      [array] $hierarchy.children =
        $Node.tree
        | ConvertTo-TipitakaHierarchy $SrcRoot
    } elseif ($Node.tree -isnot [array]) {
      [array] $hierarchy.children =
        $Node.tree.tree
        | ConvertTo-TipitakaHierarchy $SrcRoot
    } else {
      throw "Unknown node type: $($Node.Name)"
    }

    $hierarchy.id = "{0} | {1}" -f $nodeType, ($hierarchy.id -ireplace "^(\.\/)").ToLowerInvariant()

    [PSCustomObject]$hierarchy
  }
}

$tocFile = Join-Path $SrcDir "tipitaka_toc.xml"
Write-Host "Generating Hierarchy with $tocFile"
$toc = [xml](Get-Content $tocFile)

$hierarchy = $toc | ConvertTo-TipitakaHierarchy $SrcRoot

$outFile = Join-Path $PSScriptRoot "..\src\pages\WordFrequency\components\TipitakaHierarchy\tipitakahierarchy.json"
$hierarchy | ConvertTo-Json -Depth 15 >$outFile

# Self tests
#
$expectedNodeCount = 2955

Write-Host "... Check that expected count is $expectedNodeCount " -NoNewline
$allIds = Get-Content $outFile | Where-Object { $_ -imatch '"id": "' } | ForEach-Object { $_.Trim() }
if ($allIds.Count -eq $expectedNodeCount) {
  Write-Host -ForegroundColor Green "[PASS]"
} else {
  Write-Host -ForegroundColor Red "[FAIL: Actual count is $($allIds.Count)]"
}

Write-Host "... Check that ids are unique " -NoNewline
$groups = $allIds | Group-Object
if ($allIds.Count -eq $groups.Count) {
  Write-Host -ForegroundColor Green "[PASS]"
} else {
  Write-Host -ForegroundColor Red "[FAIL: One or more ids not unque! ($($allIds.Count) vs $($groups.Count))]"
}
