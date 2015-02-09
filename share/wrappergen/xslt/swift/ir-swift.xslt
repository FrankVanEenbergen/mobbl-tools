<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- 

Stylesheet: java

(C) Copyright Itude Mobile B.V., The Netherlands

Licensed under the Apache License, Version 2.0 (the "License");
you may not use self file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->

<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:mobbl="http://itude.com/schemas/MB/2.0"
  xmlns:mbxsl="http://itude.com/schemas/MBXSL/1.0"
  xmlns:swift="http://itude.com/schemas/codegen/ir/swift">

  <xsl:output method="text" indent="yes" />
  <xsl:strip-space elements="*"/>

  <xsl:template match="/swift:source-dir[not(swift:source-file)]">
    <xsl:message>No classes generated for <xsl:value-of select="@origin" /></xsl:message>
  </xsl:template>

  <xsl:template match="/swift:source-dir/swift:source-file">
    <xsl:variable name="fileName" select="concat(@name, '.swift')" />

    <xsl:message>Created <xsl:value-of select="$fileName" /></xsl:message>

    <xsl:choose>
      <xsl:when test="../@stream-to-stdout = 'true'">
        <xsl:text>// Would be generated in: </xsl:text><xsl:value-of select="concat(../@path,'/',$fileName)" /><xsl:text>
</xsl:text>
        <xsl:call-template name="FileContents" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:result-document href="{../@path}/{$fileName}">
          <xsl:call-template name="FileContents" />
        </xsl:result-document>
      </xsl:otherwise>
    </xsl:choose>
</xsl:template>

  <xsl:template name="FileContents">

// Generated from <xsl:value-of select="../@origin" />

      <xsl:apply-templates />
  </xsl:template>


  <!-- DOCUMENT WRAPPER -->
  <xsl:template match="swift:wrapper[@entity-type='document']">
// Generated wrapper class for document "<xsl:value-of select="@entity-name" />"
class <xsl:value-of select="@name" /> : NSObject {
    let document: MBDocument

    init(document: MBDocument) {
        self.document = document
    }

    var elementContainer: MBElementContainer {
        get {
            return self.document
        }
    }

    var absolutePath : String {
        get {
            return ""
        }
    }

    override var description : String { 
        get {
            return document.description
        }
    }


  <xsl:apply-templates />

}
  </xsl:template>

  <!-- ELEMENT WRAPPER -->
  <xsl:template match="swift:wrapper[@entity-type='element']">
// Generated wrapper class for element "<xsl:value-of select="@entity-name" />"
class <xsl:value-of select="@name" /> : NSObject {
    let element: MBElement
    let siblingIndex: Int
    let parent: <xsl:value-of select="@parent-name" />

    init(element: MBElement, siblingIndex: Int, parent: <xsl:value-of select="@parent-name" />) {
        self.element = element
        self.siblingIndex = siblingIndex
        self.parent = parent
    }

    var elementContainer: MBElementContainer {
        get {
            return element
        }
    }

    var relativePath : String {
        get {
            return element.name() + "[" + siblingIndex + "]"
        }
    }

    var absolutePath : String {
        get {
            return parent.absolutePath + "/" + relativePath
        }
    }

    override var description : String { 
        get {
            return element.description
        }
    }


  <xsl:apply-templates />

}
  </xsl:template>


  <!-- CREATE TEXT -->
  <xsl:template match="swift:create[@entity-type='text']">
  // Generated create method for text element "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />(value: String) {
    self.elementContainer.createElementWithName("<xsl:value-of select="@entity-name" />").setBodyText(value)
  }
  </xsl:template>

  <xsl:template match="swift:create-indexed[@entity-type='text']">
  // Generated indexed create method for text element "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />(value: String, atIndex index: Int) {
    self.elementContainer.createElementWithName("<xsl:value-of select="@entity-name" />", atIndex:index).setBodyText(value)
  }
  </xsl:template>


  <!-- CREATE ELEMENT -->
  <xsl:template match="swift:create[@entity-type='element']">
  // Generated create method for element "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />() -> <xsl:value-of select="@wrapper-name" /> {
  return <xsl:value-of select="@wrapper-name" />(element: self.elementContainer.createElementWithName("<xsl:value-of select="@entity-name" />"), siblingIndex: elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />").count, parent: self)
  }
  </xsl:template>

  <xsl:template match="swift:create-indexed[@entity-type='element']">
  // Generated indexed create method for element "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />(atIndex index: Int) -> <xsl:value-of select="@wrapper-name" /> {
    return <xsl:value-of select="@wrapper-name" />(element: self.elementContainer.createElementWithName("<xsl:value-of select="@entity-name" />", atIndex:index), siblingIndex: index, parent: self)
  }
  </xsl:template>


  <!-- TEXT/ATTRIBUTE PROPERTY -->
  <xsl:template match="swift:property[@entity-type='text' or @entity-type='attribute']">
  // Generated read/write property for text element "<xsl:value-of select="@entity-name" />"
  var <xsl:value-of select="@name" />: String {
    <xsl:apply-templates />
  }
  </xsl:template>

  <!-- TEXT GETTER -->
  <xsl:template match="swift:get[../@entity-type='text']">
    get {
        return self.elementContainer.elementsWithName("<xsl:value-of select="../@entity-name" />").objectAtIndex(0).bodyText()
    }
  </xsl:template>

  <!-- TEXT SETTER -->
  <xsl:template match="swift:set[../@entity-type='text']">
    set {
        self.elementContainer.elementsWithName("<xsl:value-of select="../@entity-name" />").objectAtIndex(0).setBodyText(newValue)
    }
  </xsl:template>

  <!-- INDEXED READ TEXT -->
  <xsl:template match="swift:read-indexed[@entity-type='text']">
  // Generated indexed read method for text element "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />(atIndex index: Int) -> String {
    return self.elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />").objectAtIndex(index).bodyText()
  }
  </xsl:template>

  <!-- ELEMENT PROPERTY -->
  <xsl:template match="swift:property[@entity-type='element']">
  // Generated read/write property for text element "<xsl:value-of select="@entity-name" />"
  var <xsl:value-of select="@name" />: <xsl:value-of select="@wrapper-name" /> {
    <xsl:apply-templates />
  }
  </xsl:template>

  <!-- ELEMENT GETTER -->
  <xsl:template match="swift:get[../@entity-type='element']">
    get {
        return <xsl:value-of select="../@wrapper-name" />(element: self.elementContainer.elementsWithName("<xsl:value-of select="../@entity-name" />").objectAtIndex(0) as MBElement, siblingIndex: 0, parent: self)
    }
  </xsl:template>

  <!-- INDEXED READ ELEMENT -->
  <xsl:template match="swift:read-indexed[@entity-type='element']">
  // Generated indexed read method for element "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />(atIndex index: Int) -> <xsl:value-of select="@wrapper-name" /> {
    return <xsl:value-of select="@wrapper-name" />(element: self.elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />").objectAtIndex(index) as MBElement, siblingIndex: index, parent: self)
  }
  </xsl:template>


  <!-- ATTRIBUTE GETTER -->

  <xsl:template match="swift:get[../@entity-type='attribute']">
    get {
        return self.element.valueForAttribute("<xsl:value-of select="../@entity-name" />")
    }
  </xsl:template>

  <!-- ATTRIBUTE SETTER -->

  <xsl:template match="swift:set[../@entity-type='attribute']">
    set {
        self.element.setValue(newValue, forAttribute: "<xsl:value-of select="../@entity-name" />")
    }
  </xsl:template>


  <!-- INDEXED UPDATE TEXT -->
  <xsl:template match="swift:update-indexed[@entity-type='text']">
  // Generated indexed update method for text element "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />(value: String, atIndex index: Int) {
    self.elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />").objectAtIndex(index).setBodyText(value)
  }
  </xsl:template>

  <!-- INDEXED DELETE ELEMENT -->
  <xsl:template match="swift:delete-indexed">
  // Generated indexed delete method for attribute "<xsl:value-of select="@entity-name" />"
  func <xsl:value-of select="@name" />(atIndex index: Int) {
    self.elementContainer.deleteElementWithName("<xsl:value-of select="@entity-name" />", atIndex:CInt(index))
  }
  </xsl:template>


  <!-- COUNT ELEMENTS -->

  <xsl:template match="swift:count">
  // Generated count method for (text) element "<xsl:value-of select="@entity-name" />"
  var <xsl:value-of select="@name" /> : Int {
      get {
          return self.elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />").count
      }
  }
  </xsl:template>

  <!-- ARRAY PROPERTIES -->
  <xsl:template match="swift:array-property[@entity-type='text']">
    // Generated array property for text element "<xsl:value-of select="@entity-name" />"
    var <xsl:value-of select="@name" /> : [String] {
        get {
            let elements = elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />") as [AnyObject] as [MBElement]
            return elements.map() { $0.bodyText() }
        }
    }
  </xsl:template>

  <xsl:template match="swift:array-property[@entity-type='element']">
    // Generated array property for element "<xsl:value-of select="@entity-name" />"
    var <xsl:value-of select="@name" /> : [<xsl:value-of select="@wrapper-name" />] {
        get {
            let range = 0 ..&lt; elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />").count
            return range.map() { index in <xsl:value-of select="@wrapper-name" />(element: self.elementContainer.elementsWithName("<xsl:value-of select="@entity-name" />").objectAtIndex(index) as MBElement, siblingIndex: index, parent: self) }
        }
    }
  </xsl:template>

</xsl:stylesheet>

