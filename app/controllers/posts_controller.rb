class PostsController < ApplicationController
  before_action :set_post, only: [:show,:edit,:update, :vote]
  before_action :require_user, except: [:index, :show]
  #set up instance variable for action
  # redirect based on condition

  def index
  @posts = Post.all

  end

  def show
    @comment= Comment.new

    render :show
  end
  def new
      @post= Post.new
  end


  def create

    #Post.create(title: params[:my_title])
    @post=Post.new(post_params)
    @post.creator =current_user  #hard-coded

    if @post.save
      flash[:notice] = "Your post was created"
      redirect_to posts_path
    else

      render :new
    end
  end

  def edit

  end

  def update


    if @post.update(post_params)
      flash[:notice] = "The post was updated"
      redirect_to posts_path
    else
      render :edit
    end
  end

  def vote

        @vote = Vote.create(voteable: @post, creator: current_user, vote: params[:vote])
    if @vote.valid?
      flash[:notice] = "Vote counted"

    else
      flash[:error] = "Vote for #{@post.title} not counted"
    end
    redirect_to :back
  end

  private

  def post_params

      params.require(:post).permit(:title, :url, :description, category_ids: [])

  end

  def set_post
    @post = Post.find(params[:id])

  end

end
