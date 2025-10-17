class NewsletterController < ApplicationController
  before_action :ensure_content_generator

  def index
    @newsletter_data = @content_generator.generate_newsletter_data
  end

  def api_data
    render json: @content_generator.generate_newsletter_data
  end

  private

  def ensure_content_generator
    @content_generator ||= ContentGenerator.new
  end
end