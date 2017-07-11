Rails.application.routes.draw do

  devise_for :users, path_names: {sign_in: 'login'}, controllers: { sessions: 'authentication/sessions' }
  root "mains#index"
  namespace :admin do
    resources :dashboards
    resources :users
    resources :categories
    resources :stations
    resources :magics
  end

 end
