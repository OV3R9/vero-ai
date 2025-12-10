-- Create table for storing suspicious emails
CREATE TABLE public.suspicious_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_email TEXT NOT NULL,
    email_content TEXT NOT NULL,
    is_suspicious BOOLEAN NOT NULL,
    risk_level TEXT NOT NULL,
    analysis_result TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing fake news articles
CREATE TABLE public.fake_news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_url TEXT NOT NULL,
    is_fake BOOLEAN NOT NULL,
    confidence_level TEXT NOT NULL,
    analysis_result TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.suspicious_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fake_news_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert access (no auth required per app design)
CREATE POLICY "Anyone can insert suspicious emails"
ON public.suspicious_emails
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view suspicious emails"
ON public.suspicious_emails
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert fake news articles"
ON public.fake_news_articles
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view fake news articles"
ON public.fake_news_articles
FOR SELECT
USING (true);