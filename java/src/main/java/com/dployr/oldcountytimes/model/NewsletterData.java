package com.dployr.oldcountytimes.model;

import java.util.List;

public class NewsletterData {
    private Header header;
    private String title;
    private Article mainArticle;
    private Column leftColumn;
    private RightColumn rightColumn;
    private ComicSection comicSection;
    private ContributeSection contributeSection;

    public NewsletterData() {}

    // Getters and setters
    public Header getHeader() { return header; }
    public void setHeader(Header header) { this.header = header; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Article getMainArticle() { return mainArticle; }
    public void setMainArticle(Article mainArticle) { this.mainArticle = mainArticle; }

    public Column getLeftColumn() { return leftColumn; }
    public void setLeftColumn(Column leftColumn) { this.leftColumn = leftColumn; }

    public RightColumn getRightColumn() { return rightColumn; }
    public void setRightColumn(RightColumn rightColumn) { this.rightColumn = rightColumn; }

    public ComicSection getComicSection() { return comicSection; }
    public void setComicSection(ComicSection comicSection) { this.comicSection = comicSection; }

    public ContributeSection getContributeSection() { return contributeSection; }
    public void setContributeSection(ContributeSection contributeSection) { this.contributeSection = contributeSection; }

    public static class Header {
        private String edition;
        private String date;

        public Header() {}

        public String getEdition() { return edition; }
        public void setEdition(String edition) { this.edition = edition; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }

    public static class Article {
        private String title;
        private String content;
        private String imageCaption;

        public Article() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getImageCaption() { return imageCaption; }
        public void setImageCaption(String imageCaption) { this.imageCaption = imageCaption; }
    }

    public static class Column {
        private String title;
        private String content;

        public Column() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class RightColumn {
        private String title;
        private String content;
        private List<String> jokeLines;
        private String note;

        public RightColumn() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public List<String> getJokeLines() { return jokeLines; }
        public void setJokeLines(List<String> jokeLines) { this.jokeLines = jokeLines; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }

    public static class ComicSection {
        private String title;
        private String caption;

        public ComicSection() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCaption() { return caption; }
        public void setCaption(String caption) { this.caption = caption; }
    }

    public static class ContributeSection {
        private String title;
        private List<String> paragraphs;

        public ContributeSection() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public List<String> getParagraphs() { return paragraphs; }
        public void setParagraphs(List<String> paragraphs) { this.paragraphs = paragraphs; }
    }
}