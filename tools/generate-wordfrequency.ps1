$file = "/mnt/d/src/dpt/cst/cscd/s0201m.mul0.xml"

$rendBlackList = "centre", "nikaya", "book", "chapter", "subhead"
$nodeBackList = "hi", "pb", "note"

# Filter out unnecessary tags
#
$nodes = Select-Xml -Path $file -XPath "//p" | Where-Object {
  $_.Node.rend -notin $rendBlackList
} # TODO: Collect the rest for review

$nodes | ForEach-Object {
  $node = $_
  $nodeBackList | ForEach-Object {
    Select-Xml -Xml $node.Node -XPath $_
  } | ForEach-Object {
    $_.Node.ParentNode.RemoveChild($_.Node)
  }
} | Out-Null # TODO: Collect the rest of review

# Get lower case of all node texts
#
$linesRaw = $nodes | ForEach-Object { $_.Node.InnerText.ToLower() }

# Remove punctuation
#
$linesNoPunctuations = $linesRaw | ForEach-Object {
  $_.Replace("…pe…", "")
} | ForEach-Object {
  $_ -replace "[.,?‘;’–-…]"
}
