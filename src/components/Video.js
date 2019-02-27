if (!Element.prototype.requestFullscreen) {
    Element.prototype.requestFullscreen =
    Element.prototype.mozRequestFullscreen ||
    Element.prototype.webkitRequestFullscreen ||
    Element.prototype.msRequestFullscreen;
}

const Video = {
    Create(container) {
        return {container, ...this.methods};
    },
    methods: {
        video: null,
        template({src, thumb}) {
            return `
            <div class="video__container">
                <a href="#" class="video__close" id="videoCloseBtn">close</a>
                <video controls autoplay poster="public/${thumb}" id="video">
                    <source src="public/${src}" type="video/mp4">
                </video>
            </div>
        `;
        },
        render(data) {
            this.container.innerHTML = this.template(data);
            this.container.style.display = 'block';
            this.video = document.getElementById('video');
            
            document.getElementById('videoCloseBtn').addEventListener('click', this.stop.bind(this), false);
        },
        play(data) {
            this.render(data);
            // this.video.requestFullscreen();
        },
        stop(e) {
            e.preventDefault();
            this.video.pause();
            this.container.style.display = 'none';
            this.container.innerHTML = '';
        },
    }
};

export default Video;
