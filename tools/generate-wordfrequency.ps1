Clear-Host

$file = "d:/src/dpt/cst/cscd/s0201m.mul0.xml"

$rendBlackList = "centre", "nikaya", "book", "chapter", "subhead"
$nodeBackList = "hi", "pb", "note"

$includeForWCPropName = "_includeForWC"

function ExcludeForWC {
  param ($node)

  $node.SetAttribute($includeForWCPropName, $False)
}

function IsNodeExcluded {
  param ($node)

  $node.Attributes -and $node.Attributes[$includeForWCPropName].Value -ceq "False"
}

function GetAllExcludedText {
  param ($nodesRaw)

  $xmlString = "<body>$(($nodesRaw | ForEach-Object { $_.Node.OuterXml }) -join "`n")</body>"
  Select-Xml -Xml ([xml]$xmlString) -XPath "//*[@$($includeForWCPropName)='False']" | ForEach-Object {
    $_.Node.InnerText
  } | Where-Object { $_ }
}

function GetAllIncludedText {
  param (
    [Parameter(ValueFromPipeline = $true)]
    $node
  )

  Begin {}

  Process {
    if (-not (IsNodeExcluded $node.Node)) {
      $toRemove = $node.Node.ChildNodes | Where-Object { IsNodeExcluded $_ }
      $toRemove | ForEach-Object { $_.ParentNode.RemoveChild($_) } | Out-Null
      $node.Node.InnerXml.ToLower() # Keep it InnerXml so we catch any children that haven't been removed.
    }
  }

  End {}
}

function MarkNodesExcludedFromWC {
  param(
    [Parameter(ValueFromPipeline = $true)]
    $node
  )

  Begin {}

  Process {
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

  End {}
}

function RemovePunctuation {
  param(
    [Parameter(ValueFromPipeline = $true)]
    $text
  )

  Begin {}

  Process {
    $text.Replace("…pe…", "") -replace "[.,?‘;’–-…]"
  }

  End {}
}

$lines = `
  Select-Xml -Path $file -XPath "//body/p" `
  | MarkNodesExcludedFromWC `
  | GetAllIncludedText `
  | RemovePunctuation `
