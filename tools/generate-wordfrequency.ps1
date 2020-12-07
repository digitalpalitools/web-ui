$file = "/mnt/d/src/dpt/cst/cscd/s0201m.mul0.xml"

$rendBlackList = "centre", "nikaya", "book", "chapter", "subhead"
$nodeBackList = "hi", "pb", "note"

$includeForWCPropName = "_includeForWC"

function ExcludeForWC {
  param ($node)

  $node.SetAttribute($includeForWCPropName, $False)
}

function IsNodeExcluded {
  param ($node)

  $node.Attributes -and $node.Attributes[$includeForWCPropName] -ceq "False"
}

function GetAllExcludedText {
  param ($nodesRaw)

  $xmlString = "<body>$(($nodesRaw | ForEach-Object { $_.Node.OuterXml }) -join "`n")</body>"
  Select-Xml -Xml ([xml]$xmlString) -XPath "//*[@$($includeForWCPropName)='False']" | ForEach-Object {
    $_.Node.InnerText
  } | Where-Object { $_ }
}

function GetAllIncludedText {
  param ($nodesRaw)

  $nodesRaw | Where-Object {
    -not (IsNodeExcluded $_.Node)
  } | ForEach-Object {
    $_.Node.ChildNodes | Where-Object {
      IsNodeExcluded $_
    } | ForEach-Object {
      $_.ParentNode.RemoveChild($_)
    }

    $_
  } | ForEach-Object {
    $_.Node.InnerText.ToLower()
  }
}

# Mark tags that need to be filtered out
#
$nodeListRaw = Select-Xml -Path $file -XPath "//body/p" | ForEach-Object {
  $node = $_
  if ($_.Node.rend -in $rendBlackList) {
    ExcludeForWC $node.Node
  } else {
    $nodeBackList | ForEach-Object {
      Select-Xml -Xml $node.Node -XPath $_
    } | ForEach-Object {
      ExcludeForWC $_.Node
    }
  }

  $node
}

$linesRaw = GetAllIncludedText $nodeListRaw

# Remove punctuation
#
$linesNoPunctuations = $linesRaw | ForEach-Object {
  $_.Replace("…pe…", "")
} | ForEach-Object {
  $_ -replace "[.,?‘;’–-…]"
}

$linesNoPunctuations
