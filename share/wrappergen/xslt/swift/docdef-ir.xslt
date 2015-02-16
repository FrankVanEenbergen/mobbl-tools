<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- 

Stylesheet: docdef -> Swift IR

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
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:mb="http://itude.com/schemas/MB/2.0"
  xmlns:endpoints="http://itude.com/schemas/MB/1.0"
  xmlns:mbxsl="http://itude.com/schemas/MBXSL/1.0"
  xmlns:swift="http://itude.com/schemas/codegen/ir/swift">

  <xsl:param name="devMode" as="xs:boolean" />
  <xsl:param name="outputDirectory" />
  <xsl:param name="origin" />
  <xsl:param name="class-prefix" />

  <xsl:strip-space elements="*"/>

  <xsl:function name="mbxsl:capitalize">
    <xsl:param name="input" />
    <xsl:sequence select="concat(upper-case(substring($input, 1, 1)), substring($input, 2))" />
  </xsl:function>

  <xsl:function name="mbxsl:to-valid-identifier">
    <xsl:param name="document-name" />
    <xsl:sequence select="replace($document-name, '-', '_')" />
  </xsl:function>

  <xsl:function name="mbxsl:to-capitalized-identifier">
    <xsl:param name="raw-name" />
    <xsl:sequence select="mbxsl:capitalize(mbxsl:to-valid-identifier($raw-name))" />
  </xsl:function>

  <xsl:function name="mbxsl:prefixed-class-name" as="xs:string">
    <xsl:param name="element" />

    <xsl:value-of select="concat($class-prefix, string-join($element/(ancestor-or-self::mb:Document|ancestor-or-self::mb:Element)/mbxsl:to-capitalized-identifier(@name), '_'))" />
  </xsl:function>

  <xsl:template match="/endpoints:EndPoints">
    <swift:source-dir path="{$outputDirectory}" origin="{$origin}" />
  </xsl:template>

  <xsl:template match="/mb:Configuration">
    <swift:source-dir path="{$outputDirectory}" origin="{$origin}" stream-to-stdout="{$devMode = true()}">
      <xsl:apply-templates />
    </swift:source-dir>
  </xsl:template>

  <xsl:template match="mb:Model/mb:Documents/mb:Document">
    <xsl:variable name="class-name" select="mbxsl:prefixed-class-name(@name)" />

    <swift:source-file
      name="{$class-name}">
      <swift:wrapper
        name="{$class-name}"
        entity-type="document"
        entity-name="{@name}">

        <xsl:apply-templates />

      </swift:wrapper>

      <xsl:apply-templates mode="wrapper" />


    </swift:source-file>
  </xsl:template>

  <!-- match "text-only" elements (elements that only have a "text()" attribute and
       nothing else -->
  <xsl:template match="mb:Element[mb:Attribute[@name='text()'] and count(*)=1]">
    <xsl:variable name="capitalized-name" select="mbxsl:to-capitalized-identifier(@name)" />

    <swift:create
      name="create{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />
    <swift:create-indexed
      name="create{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />

    <swift:property
      name="{@name}"
      entity-type="text"
      entity-name="{@name}">
      <swift:get />
      <swift:set />
    </swift:property>

    <swift:read-indexed
      name="{@name}"
      entity-type="text"
      entity-name="{@name}" />

    <swift:check
      name="has{$capitalized-name}"
      entity-name="{@name}" />

    <swift:count
      name="numberOf{$capitalized-name}Elements"
      entity-name="{@name}" />

    <swift:array-property
      name="{@name}Array"
      entity-type="text"
      entity-name="{@name}" />

    <swift:update-indexed
      name="set{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />

    <swift:delete-indexed
      name="delete{$capitalized-name}"
      entity-name="{@name}" />

  </xsl:template>

  <!-- match "complex" elements (elements that have attributes other than
       "text()" or that have child elements -->
  <xsl:template match="mb:Element[mb:Attribute[@name='text()'] and count(*)>1] | mb:Element[not(mb:Attribute[@name='text()'])]">
    <xsl:variable name="capitalized-name" select="mbxsl:to-capitalized-identifier(@name)" />

    <xsl:variable name="class-name" select="mbxsl:prefixed-class-name(.)" />

    <swift:create
      name="create{$capitalized-name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$class-name}" />
    <swift:create-indexed
      name="create{$capitalized-name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$class-name}" />

    <swift:property
      name="{@name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$class-name}">
      <swift:get />
    </swift:property>

    <swift:read-indexed
      name="{@name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$class-name}" />

    <swift:check
      name="has{$capitalized-name}"
      entity-name="{@name}" />

    <swift:count
      name="numberOf{$capitalized-name}Elements"
      entity-name="{@name}" />

    <swift:array-property
      name="{@name}Array"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$class-name}" />

    <swift:delete-indexed
      name="delete{$capitalized-name}"
      entity-name="{@name}" />

  </xsl:template>

  <xsl:template match="mb:Element[mb:Attribute[@name='text()'] and count(*)>1] | mb:Element[not(mb:Attribute[@name='text()'])]" mode="wrapper">

    <swift:wrapper
      name="{mbxsl:prefixed-class-name(.)}"
      entity-type="element"
      entity-name="{@name}"
      parent-name="{mbxsl:prefixed-class-name(..)}">

      <xsl:apply-templates />

    </swift:wrapper>

    <xsl:apply-templates mode="wrapper" />

  </xsl:template>

  <xsl:template match="mb:Attribute[@name='text()']">
    <xsl:call-template name="Attribute">
      <xsl:with-param name="attribute-name" select="'text'" />
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="mb:Attribute[not(@name='text()')]">
    <xsl:call-template name="Attribute">
      <xsl:with-param name="attribute-name" select="@name" />
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="Attribute">
    <xsl:param name="attribute-name" />

    <swift:property
      name="{$attribute-name}"
      entity-type="attribute"
      entity-name="{$attribute-name}">
      <swift:get />
      <swift:set />
    </swift:property>

  </xsl:template>

</xsl:stylesheet>
