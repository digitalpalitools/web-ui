param (
  $SrcDir = "../../cst"
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
    }

    if ($Node.src) {
      $childHierarchyFile = Join-Path $SrcDir $Node.src
      $childHierarchyNode = [xml](Get-Content $childHierarchyFile)
      [array] $hierarchy.children =
        $childHierarchyNode.tree.ChildNodes
        | Where-Object { $_.Name -ne "#comment" }
        | ConvertTo-TipitakaHierarchy $SrcRoot
    } elseif ($Node.action) {
      $hierarchy.source = $Node.action
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

    [PSCustomObject]$hierarchy
  }
}

$tocFile = Join-Path $SrcDir "tipitaka_toc.xml"
$toc = [xml](Get-Content $tocFile)

$hierarchy = $toc | ConvertTo-TipitakaHierarchy $SrcRoot
$hierarchy.name = "Tipitaka"

$hierarchy | ConvertTo-Json -Depth 15 >..\src\pages\WordFrequency\components\TipitakaHierarchy\tipitakahierarchy.json
