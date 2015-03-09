<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- 

Stylesheet: docdef -> Java IR

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
  xmlns:java="http://itude.com/schemas/codegen/ir/java">

  <xsl:param name="devMode" as="xs:boolean" />
  <xsl:param name="outputDirectory" />
  <xsl:param name="package" />
  <xsl:param name="origin" />

  <xsl:strip-space elements="*"/>

  <xsl:function name="mbxsl:decapitalize">
    <xsl:param name="input" />
    <xsl:sequence select="concat(lower-case(substring($input, 1, 1)), substring($input, 2))" />
  </xsl:function>
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

  <xsl:function name="mbxsl:to-decapitalized-identifier">
    <xsl:param name="raw-name" />
    <xsl:sequence select="mbxsl:decapitalize(mbxsl:to-valid-identifier($raw-name))" />
  </xsl:function>

  <xsl:function name="mbxsl:package-to-path">
    <xsl:param name="package" />
    <xsl:sequence select="replace($package, '\.', '/')" />
  </xsl:function>

  <xsl:template match="/endpoints:EndPoints">
    <java:source-dir path="{$outputDirectory}" origin="{$origin}" />
  </xsl:template>

  <xsl:template match="/mb:Configuration">
    <java:source-dir path="{$outputDirectory}" origin="{$origin}" stream-to-stdout="{$devMode = true()}">
      <xsl:apply-templates />
    </java:source-dir>
  </xsl:template>

  <xsl:template match="mb:Model/mb:Documents/mb:Document">
    <xsl:variable name="class-name" select="mbxsl:to-capitalized-identifier(@name)" />

    <java:source-file
      name="{$class-name}"
      package="{$package}"
      package-path="{mbxsl:package-to-path($package)}">
      <java:wrapper
        name="{$class-name}"
        entity-type="document"
        entity-name="{@name}">

        <xsl:apply-templates />

      </java:wrapper>
    </java:source-file>
  </xsl:template>

  <!-- match "text-only" elements (elements that only have a "text()" attribute and
       nothing else -->
  <xsl:template match="mb:Element[mb:Attribute[@name='text()'] and count(*)=1]">
    <xsl:variable name="capitalized-name" select="mbxsl:to-capitalized-identifier(@name)" />

    <java:create
      name="create{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />
    <java:create-indexed
      name="create{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />

    <java:read
      name="get{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />
    <java:read-indexed
      name="get{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />
    <java:read-list
      name="get{$capitalized-name}List"
      entity-type="text"
      entity-name="{@name}" />

    <java:check
      name="has{$capitalized-name}"
      entity-name="{@name}" />

    <java:count
      name="getNumberOf{$capitalized-name}Elements"
      entity-name="{@name}" />

    <java:update
      name="set{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />
    <java:update-indexed
      name="set{$capitalized-name}"
      entity-type="text"
      entity-name="{@name}" />

    <java:delete-indexed
      name="delete{$capitalized-name}"
      entity-name="{@name}" />

  </xsl:template>

  <xsl:function name="mbxsl:postfixed-class-name">
    <xsl:param name="entity" />

    <xsl:variable
      name="number-of-colliding-ancestor-names"
      select="count($entity/ancestor::*[mbxsl:capitalize(@name) = mbxsl:capitalize($entity/@name)])" />

    <xsl:value-of select="if ($number-of-colliding-ancestor-names > 0)
      then concat(mbxsl:to-capitalized-identifier($entity/@name),'_',$number-of-colliding-ancestor-names)
      else mbxsl:to-capitalized-identifier($entity/@name)" />
  </xsl:function>

  <!-- match "complex" elements (elements that have attributes other than
       "text()" or that have child elements -->
  <xsl:template match="mb:Element[mb:Attribute[@name='text()'] and count(*)>1] | mb:Element[not(mb:Attribute[@name='text()'])]">
    <xsl:variable name="capitalized-name" select="mbxsl:to-capitalized-identifier(@name)" />

    <xsl:variable name="postfixed-class-name" select="mbxsl:postfixed-class-name(.)" />

    <java:create
      name="create{$capitalized-name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$postfixed-class-name}" />
    <java:create-indexed
      name="create{$capitalized-name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$postfixed-class-name}" />

    <java:read
      name="get{$capitalized-name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$postfixed-class-name}" />
    <java:read-indexed
      name="get{$capitalized-name}"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$postfixed-class-name}" />
    <java:read-list
      name="get{$capitalized-name}List"
      entity-type="element"
      entity-name="{@name}"
      wrapper-name="{$postfixed-class-name}" />

    <java:check
      name="has{$capitalized-name}"
      entity-name="{@name}" />

    <java:count
      name="getNumberOf{$capitalized-name}Elements"
      entity-name="{@name}" />

    <java:delete-indexed
      name="delete{$capitalized-name}"
      entity-name="{@name}" />

    <java:wrapper
      name="{$postfixed-class-name}"
      entity-type="element"
      entity-name="{@name}">

      <xsl:apply-templates />

    </java:wrapper>
  </xsl:template>

  <xsl:template match="mb:Attribute[@name='text()']">
    <xsl:call-template name="Attribute">
      <xsl:with-param name="name" select="'text'" />
      <xsl:with-param name="attribute-name" select="'text()'" />
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="mb:Attribute[not(@name='text()')]">
    <xsl:call-template name="Attribute">
      <xsl:with-param name="name" select="@name" />
      <xsl:with-param name="attribute-name" select="@name" />
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="Attribute">
    <xsl:param name="name" />
    <xsl:param name="attribute-name" />

    <java:read
      name="get{mbxsl:to-capitalized-identifier($name)}"
      entity-type="attribute"
      entity-name="{$attribute-name}" />
    <java:update
      name="set{mbxsl:to-capitalized-identifier($name)}"
      entity-type="attribute"
      entity-name="{$attribute-name}" />
  </xsl:template>

</xsl:stylesheet>
