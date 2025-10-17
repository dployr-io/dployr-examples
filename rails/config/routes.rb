Rails.application.routes.draw do
  root 'newsletter#index'
  get '/api/newsletter-data', to: 'newsletter#api_data'
end