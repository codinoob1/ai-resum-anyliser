import { type RouteConfig , index, route}  from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth' , 'routes/auth.tsx'),
    route('/upload' , 'routes/upload.tsx'),
    route('/resume/:id' , 'routes/resume.tsx'), // dynamic hai BAHI !!!!!
    route('/Wipe' , 'routes/Wipe.tsx'),
]satisfies RouteConfig;