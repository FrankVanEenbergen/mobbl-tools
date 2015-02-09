<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- 

Stylesheet: Java IR -> Java

(C) Copyright Itude Mobile B.V., The Netherlands

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
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
  xmlns:java="http://itude.com/schemas/codegen/ir/java">

  <xsl:output method="text" indent="yes" />
  <xsl:strip-space elements="*"/>

  <xsl:template match="/java:source-dir[not(java:source-file)]">
    <xsl:message>No classes generated for <xsl:value-of select="@origin" /></xsl:message>
  </xsl:template>

  <xsl:template match="/java:source-dir/java:source-file">
    <xsl:variable name="fileName" select="concat(@name, '.java')" />

    <xsl:message>Created <xsl:value-of select="$fileName" /></xsl:message>

    <xsl:choose>
      <xsl:when test="../@stream-to-stdout = 'true'">
        <xsl:text>// Would be generated in: </xsl:text><xsl:value-of select="concat(../@path,'/',@package-path,'/',$fileName)" />
        <xsl:call-template name="FileContents" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:result-document href="{../@path}/{@package-path}/{$fileName}">
          <xsl:call-template name="FileContents" />
        </xsl:result-document>
      </xsl:otherwise>
    </xsl:choose>
</xsl:template>

  <xsl:template name="FileContents">
package <xsl:value-of select="@package" />;

// Generated from <xsl:value-of select="../@origin" />

import java.util.List;
import java.util.ArrayList;
import com.itude.mobile.mobbl.core.model.MBDocument;
import com.itude.mobile.mobbl.core.model.MBElement;
import com.itude.mobile.mobbl.core.model.MBElementContainer;

      <xsl:apply-templates />
  </xsl:template>


  <!-- DOCUMENT WRAPPER -->
  <xsl:template match="java:wrapper[@entity-type='document']">
// Generated wrapper class for document "<xsl:value-of select="@entity-name" />"
public class <xsl:value-of select="@name" /> {
  private final MBDocument document;

  public <xsl:value-of select="@name" />(final MBDocument document) {
    this.document = document;
  }

  public MBDocument getDocument() {
    return this.document;
  }

  public MBElementContainer getElementContainer() {
    return this.document;
  }

  public String getAbsolutePath() {
    return "";
  }

  @Override
  public String toString() {
    return this.document.toString();
  }

  <xsl:apply-templates />

}
  </xsl:template>

  <!-- ELEMENT WRAPPER -->
  <xsl:template match="java:wrapper[@entity-type='element']">
// Generated wrapper class for element "<xsl:value-of select="@entity-name" />"
public static class <xsl:value-of select="@name" /> {
  private final MBElement element;
  private final int siblingIndex;
  private final <xsl:value-of select="../@name" /> parent;

  public <xsl:value-of select="@name" />(final MBElement element, final int siblingIndex, final <xsl:value-of select="../@name" /> parent) {
    this.element = element;
    this.siblingIndex = siblingIndex;
    this.parent = parent;
  }

  public MBElement getElement() {
    return this.element;
  }

  public MBElementContainer getElementContainer() {
    return this.element;
  }

  public String getRelativePath() {
    return this.element.getName() + "[" + this.siblingIndex + "]";
  }

  public String getAbsolutePath() {
    return this.parent.getAbsolutePath() + "/" + getRelativePath();
  }

  @Override
  public String toString() {
    return this.element.toString();
  }

  <xsl:apply-templates />

}
  </xsl:template>


  <!-- CREATE TEXT -->
  <xsl:template match="java:create[@entity-type='text']">
  // Generated create method for text element "<xsl:value-of select="@entity-name" />"
  public void <xsl:value-of select="@name" />(final String value) {
    this.getElementContainer().createElement("<xsl:value-of select="@entity-name" />").setBodyText(value);
  }
  </xsl:template>

  <xsl:template match="java:create-indexed[@entity-type='text']">
  // Generated indexed create method for text element "<xsl:value-of select="@entity-name" />"
  public void <xsl:value-of select="@name" />(final String value, final int index) {
    this.getElementContainer().createElement("<xsl:value-of select="@entity-name" />", index).setBodyText(value);
  }
  </xsl:template>


  <!-- CREATE ELEMENT -->
  <xsl:template match="java:create[@entity-type='element']">
  // Generated create method for element "<xsl:value-of select="@entity-name" />"
  public <xsl:value-of select="@wrapper-name" /><xsl:text> </xsl:text><xsl:value-of select="@name" />() {
  return new <xsl:value-of select="@wrapper-name" />(this.getElementContainer().createElement("<xsl:value-of select="@entity-name" />"), getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").size(), this);
  }
  </xsl:template>

  <xsl:template match="java:create-indexed[@entity-type='element']">
  // Generated indexed create method for element "<xsl:value-of select="@entity-name" />"
  public <xsl:value-of select="@wrapper-name" /><xsl:text> </xsl:text><xsl:value-of select="@name" />(final int index) {
    return new <xsl:value-of select="@wrapper-name" />(this.getElementContainer().createElement("<xsl:value-of select="@entity-name" />", index), index, this);
  }
  </xsl:template>


  <!-- READ TEXT -->
  <xsl:template match="java:read[@entity-type='text']">
  // Generated read method for text element "<xsl:value-of select="@entity-name" />"
  public String <xsl:value-of select="@name" />() {
    return this.getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").get(0).getBodyText();
  }
  </xsl:template>

  <xsl:template match="java:read-indexed[@entity-type='text']">
  // Generated indexed read method for text element "<xsl:value-of select="@entity-name" />"
  public String <xsl:value-of select="@name" />(final int index) {
    return this.getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").get(index).getBodyText();
  }
  </xsl:template>


  <!-- READ ELEMENT -->
  <xsl:template match="java:read[@entity-type='element']">
  // Generated read method for element "<xsl:value-of select="@entity-name" />"
  public <xsl:value-of select="@wrapper-name" /><xsl:text> </xsl:text><xsl:value-of select="@name" />() {
    return new <xsl:value-of select="@wrapper-name" />(this.getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").get(0), 0, this);
  }
  </xsl:template>

  <xsl:template match="java:read-indexed[@entity-type='element']">
  // Generated indexed read method for element "<xsl:value-of select="@entity-name" />"
  public <xsl:value-of select="@wrapper-name" /><xsl:text> </xsl:text><xsl:value-of select="@name" />(final int index) {
    return new <xsl:value-of select="@wrapper-name" />(this.getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").get(index), index, this);
  }
  </xsl:template>

  <!-- READ TEXT ELEMENT LIST -->
  <xsl:template match="java:read-list[@entity-type='text']">
  // Generated list read method for text element "<xsl:value-of select="@entity-name" />"
  public List&lt;String&gt; <xsl:value-of select="@name" />() {
    List&lt;String&gt; list = new ArrayList&lt;String&gt;();
    for (MBElement element : getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />")) {
      list.add(element.getBodyText());
    }
    return list;
  }
  </xsl:template>

  <!-- READ ELEMENT LIST -->
  <xsl:template match="java:read-list[@entity-type='element']">
  // Generated list read method for text element "<xsl:value-of select="@entity-name" />"
  public List&lt;<xsl:value-of select="@wrapper-name" />&gt; <xsl:value-of select="@name" />() {
    final List&lt;<xsl:value-of select="@wrapper-name" />&gt; list = new ArrayList&lt;<xsl:value-of select="@wrapper-name" />&gt;();
    final List&lt;MBElement&gt; elements = getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />");
    for (int index = 0; index &lt; elements.size(); index++) {
      list.add(new <xsl:value-of select="@wrapper-name" />(elements.get(index), index, this));
    }
    return list;
  }
  </xsl:template>



  <!-- READ ATTRIBUTE -->

  <xsl:template match="java:read[@entity-type='attribute']">
  // Generated read method for attribute "<xsl:value-of select="@entity-name" />"
  public String <xsl:value-of select="@name" />() {
    return this.element.getValueForAttribute("<xsl:value-of select="@entity-name" />");
  }
  </xsl:template>


  <!-- UPDATE TEXT -->

  <xsl:template match="java:update[@entity-type='text']">
  // Generated update method for text element "<xsl:value-of select="@entity-name" />"
  public void <xsl:value-of select="@name" />(final String value) {
    this.getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").get(0).setBodyText(value);
  }
  </xsl:template>

  <xsl:template match="java:update-indexed[@entity-type='text']">
  // Generated indexed update method for text element "<xsl:value-of select="@entity-name" />"
  public void <xsl:value-of select="@name" />(final String value, final int index) {
    this.getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").get(index).setBodyText(value);
  }
  </xsl:template>


  <!-- UPDATE ATTRIBUTE -->

  <xsl:template match="java:update[@entity-type='attribute']">
  // Generated update method for attribute "<xsl:value-of select="@entity-name" />"
  public void <xsl:value-of select="@name" />(final String value) {
    this.element.setAttributeValue(value, "<xsl:value-of select="@entity-name" />");
  }
  </xsl:template>

  <!-- INDEXED DELETE ELEMENT -->
  <xsl:template match="java:delete-indexed">
  // Generated indexed delete method for attribute "<xsl:value-of select="@entity-name" />"
  public void <xsl:value-of select="@name" />(final int index) {
    this.getElementContainer().deleteElementWithName("<xsl:value-of select="@entity-name" />", index);
  }
  </xsl:template>

  <!-- COUNT ELEMENTS -->
  <xsl:template match="java:count">
  // Generated count method for (text) element "<xsl:value-of select="@entity-name" />"
  public int <xsl:value-of select="@name" />() {
    return this.getElementContainer().getElementsWithName("<xsl:value-of select="@entity-name" />").size();
  }
  </xsl:template>

</xsl:stylesheet>

