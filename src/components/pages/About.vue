<template>
    <div class='heroAbout'>
        <div class='hero__overlay'>
            <div class='split left'>
                <h1> Our Mission</h1>
                <p>To democratize access to technology and entrepreneurship—resources and expertise that empower  every community in Africa to innovate and thrive.</p>
                <p> We deliver this impact through curated event experiences designed to inspire, connect, and activate changemakers across the continent.</p>
                <h1> Our Vision</h1>
                <p> Empowerment & Innovation
                    We host technology events in underserved areas—providing tools, knowledge, and networks to help individuals and communities unlock their potential and drive meaningful change.</p>
                <p>
                    We build supportive entrepreneurial ecosystems across Africa—enabling aspiring entrepreneurs to learn, grow, and drive economic and social progress in their communities.
                </p> 
                </div> 
                <div class="split right">
                    <img src="@/assets/Bg6.jpg" alt="Impact logo" />
                </div>      
        </div>
      <div>
        <h1>Who we Are</h1>
      </div>  
    </div>

</template>
<script>
export default {
    name: 'About',
}
</script>
<style scoped>
.heroAbout{
    font-family: sans-serif;
    font-size: small;
    margin-top: 0%;
    
}
.hero__overlay{
    display:flex;
    width: 100%;
    height: 100%;
 } 
.split {
    position: relative;
    height: 100%;
    width: 50%;
    overflow: hidden;
    /* z-index: 1; */
}
.split.left {
    left: 0;
    background-color: black;
    color: white;
    height: 60vh;
}
.split.left p{
    margin: 0;
    padding: 0px;
    font-size: 0.8rem;
    line-height: 1.5;
}
.split.right{
    right:0;
    width: 50%;
    height: 100%;
    position: relative; 
    height:60vh;
}
.split.right img {
    max-width: 100%;
    height: 70vh;
    align-items: right;
    object-fit: cover; /* Ensures the image scales properly */
}
</style>