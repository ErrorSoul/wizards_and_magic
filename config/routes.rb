Rails.application.routes.draw do

  devise_for :users, path_names: {sign_in: 'login'}, controllers: { sessions: 'authentication/sessions' }
  root "mains#index"
  post "/mains/photo", to: "mains#photo"
  get "/mains/photo", to: "mains#photo"
  namespace :admin do
    resources :dashboards
    resources :users
    resources :categories
    resources :stations
    resources :magics
    resources :wizards do
      get :profile, on: :collection
    end
  end

 end
